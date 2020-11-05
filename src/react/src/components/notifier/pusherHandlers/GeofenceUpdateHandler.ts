import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import {
    undoPendingUpdateMapGeofenceByCorrelationId,
    removePendingUpdateMapGeofenceById,
    updateMapGeofenceStatusByCorrelationId,
} from '../../../redux/actions/GeofenceActions';

export default function GeofenceUpdateHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        if (data.status === StatusEnum.REJECTED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'error',
                },
            } as SnackbarNotification;
            const undoPendingUpdateGeofenceByCorrelationIdAction = undoPendingUpdateMapGeofenceByCorrelationId(data.correlationId);
            ReduxStore.getStore().dispatch(undoPendingUpdateGeofenceByCorrelationIdAction);
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
            const removePendingUpdateGeofenceByCorrelationIdAction = removePendingUpdateMapGeofenceById(data.resourceId);
            ReduxStore.getStore().dispatch(removePendingUpdateGeofenceByCorrelationIdAction);
            ReduxStore.getStore().dispatch(updateGeofenceByCorrelationIdAction);
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        }
    }
}
