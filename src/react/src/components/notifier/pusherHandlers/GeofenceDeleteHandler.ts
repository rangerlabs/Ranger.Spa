import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { removePendingDeleteMapGeofenceByCorrelationId, undoPendingDeleteMapGeofenceByCorrelationId } from '../../../redux/actions/GeofenceActions';

export default function GeofenceDeleteHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        if (data.status === StatusEnum.REJECTED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'error',
                },
            } as SnackbarNotification;
            const removeGeofenceByCorrelationIdAction = undoPendingDeleteMapGeofenceByCorrelationId(data.correlationId);
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
            const removePendingDeleteGeofenceByCorrelationIdAction = removePendingDeleteMapGeofenceByCorrelationId(data.correlationId);
            ReduxStore.getStore().dispatch(removePendingDeleteGeofenceByCorrelationIdAction);
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        }
    }
}
