import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { removePendingDeleteMapGeofenceByCorrelationId, addMapGeofence } from '../../../redux/actions/GeofenceActions';

export default function GeofenceDeleteHandler(data: PusherNotificationModel): void {
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

            const pendingGeofence = ReduxStore.getState().geofencesState.pendingDeletion.find((g) => g.correlationModel.correlationId === data.correlationId);
            const addGeofence = addMapGeofence(pendingGeofence);
            store.dispatch(addGeofence);

            const removeGeofenceByCorrelationIdAction = removePendingDeleteMapGeofenceByCorrelationId(data.correlationId);
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
            const removePendingDeleteGeofenceByCorrelationIdAction = removePendingDeleteMapGeofenceByCorrelationId(data.correlationId);
            store.dispatch(removePendingDeleteGeofenceByCorrelationIdAction);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        }
    }
}
