import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { removePendingDeleteGeofencesByCorrelationId, resetTableGeofences } from '../../../redux/actions/GeofenceActions';

export default function GeofenceBulkDeleteHandler(data: PusherNotificationModel): void {
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

            const removeGeofenceByCorrelationIdAction = removePendingDeleteGeofencesByCorrelationId(data.correlationId);
            store.dispatch(removeGeofenceByCorrelationIdAction);

            const resetTableGeofencesAction = resetTableGeofences();
            store.dispatch(resetTableGeofencesAction);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        } else if (data.status === StatusEnum.COMPLETED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const removePendingDeleteGeofenceByCorrelationIdAction = removePendingDeleteGeofencesByCorrelationId(data.correlationId);
            store.dispatch(removePendingDeleteGeofenceByCorrelationIdAction);

            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            store.dispatch(enqueueSnackbarAction);
        }
    }
}
