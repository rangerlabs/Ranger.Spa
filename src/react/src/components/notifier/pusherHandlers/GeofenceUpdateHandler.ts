import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { removePendingUpdateMapGeofenceByResourceId, addMapGeofence } from '../../../redux/actions/GeofenceActions';

export default function GeofenceUpdateHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        const store = ReduxStore.getStore();
        if (data.status === StatusEnum.REJECTED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'error',
                },
            } as SnackbarNotification;

            const pendingGeofence = ReduxStore.getState().geofencesState.pendingUpdate.find((g) => g.old.correlationModel.correlationId === data.correlationId)
                .old;
            pendingGeofence.correlationModel = { correlationId: data.correlationId, status: data.status, resourceId: data.resourceId };
            const addGeofenceAction = addMapGeofence(pendingGeofence);
            store.dispatch(addGeofenceAction);

            const removePendingUpdateGeofenceByCorrelationIdAction = removePendingUpdateMapGeofenceByResourceId(data.resourceId);
            store.dispatch(removePendingUpdateGeofenceByCorrelationIdAction);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        } else if (data.status === StatusEnum.COMPLETED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const pendingGeofence = ReduxStore.getState().geofencesState.pendingUpdate.find((g) => g.old.correlationModel.correlationId === data.correlationId)
                .updated;
            pendingGeofence.correlationModel = { correlationId: data.correlationId, status: data.status, resourceId: data.resourceId };
            const addGeofence = addMapGeofence(pendingGeofence);
            store.dispatch(addGeofence);

            const removePendingUpdateGeofenceByCorrelationIdAction = removePendingUpdateMapGeofenceByResourceId(data.resourceId);
            store.dispatch(removePendingUpdateGeofenceByCorrelationIdAction);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        }
    }
}
