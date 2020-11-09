import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { removePendingCreateMapGeofenceByCorrelationId, addMapGeofence } from '../../../redux/actions/GeofenceActions';

export default function GeofenceCreateHandler(data: PusherNotificationModel): void {
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

            const removeGeofenceByCorrelationIdAction = removePendingCreateMapGeofenceByCorrelationId(data.correlationId);
            store.dispatch(removeGeofenceByCorrelationIdAction);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        } else if (data.status === StatusEnum.COMPLETED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;

            const removePendingGeofence = removePendingCreateMapGeofenceByCorrelationId(data.correlationId);
            store.dispatch(removePendingGeofence);

            const pendingGeofence = ReduxStore.getState().geofencesState.pendingCreation.find((g) => g.correlationModel.correlationId === data.correlationId);
            const addGeofence = addMapGeofence(pendingGeofence);
            store.dispatch(addGeofence);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        }
    }
}
