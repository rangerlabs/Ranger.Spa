import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { updateMapGeofenceStatusByCorrelationId, removeMapGeofenceByCorrelationId } from '../../../redux/actions/GeofenceActions';

export default function GeofenceCreateHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        if (data.status === StatusEnum.REJECTED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'error',
                },
            } as SnackbarNotification;
            const removeGeofenceByCorrelationIdAction = removeMapGeofenceByCorrelationId(data.correlationId);
            ReduxStore.getStore().dispatch(removeGeofenceByCorrelationIdAction);
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        } else if (data.status === StatusEnum.COMPLETED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const updateGeofenceByCorrelationIdAction = updateMapGeofenceStatusByCorrelationId({
                correlationId: data.correlationId,
                status: data.status,
                resourceId: data.resourceId,
            });
            ReduxStore.getStore().dispatch(updateGeofenceByCorrelationIdAction);
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        }
    }
}
