import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { removePendingUpdateGeofenceByResourceId, addMapGeofence } from '../../../redux/actions/GeofenceActions';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';

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

            const oldGeofence = Object.assign(
                {},
                ReduxStore.getState().geofencesState.pendingUpdate.find((g) => g.updated.correlationModel.correlationId === data.correlationId).old
            ) as CircleGeofence | PolygonGeofence;
            oldGeofence.correlationModel = { correlationId: data.correlationId, status: data.status, resourceId: data.resourceId };
            const addGeofenceAction = addMapGeofence(oldGeofence);
            store.dispatch(addGeofenceAction);

            const removePendingUpdateGeofenceByCorrelationIdAction = removePendingUpdateGeofenceByResourceId(data.resourceId);
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
            const updatedGeofence = Object.assign(
                {},
                ReduxStore.getState().geofencesState.pendingUpdate.find((g) => g.updated.correlationModel.correlationId === data.correlationId).updated
            ) as CircleGeofence | PolygonGeofence;
            updatedGeofence.correlationModel = { correlationId: data.correlationId, status: data.status, resourceId: data.resourceId };
            const addGeofence = addMapGeofence(updatedGeofence);
            store.dispatch(addGeofence);

            const removePendingUpdateGeofenceByCorrelationIdAction = removePendingUpdateGeofenceByResourceId(data.resourceId);
            store.dispatch(removePendingUpdateGeofenceByCorrelationIdAction);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        }
    }
}
