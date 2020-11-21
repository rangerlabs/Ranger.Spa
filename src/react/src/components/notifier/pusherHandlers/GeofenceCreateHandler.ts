import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { removePendingCreateGeofenceByCorrelationId, addMapGeofence } from '../../../redux/actions/GeofenceActions';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';

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

            const removeGeofenceByCorrelationIdAction = removePendingCreateGeofenceByCorrelationId(data.correlationId);
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
            const pendingGeofence = Object.assign(
                {},
                ReduxStore.getState().geofencesState.pendingCreation.find((g) => g.correlationModel.correlationId === data.correlationId)
            ) as CircleGeofence | PolygonGeofence;
            const addGeofence = addMapGeofence(pendingGeofence);
            store.dispatch(addGeofence);

            const removePendingGeofence = removePendingCreateGeofenceByCorrelationId(data.correlationId);
            store.dispatch(removePendingGeofence);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        }
    }
}
