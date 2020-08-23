import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { undoPendingDeleteUserByCorrelationId, removePendingDeleteUserByCorrelationId } from '../../../redux/actions/UserActions';

export default function UserDeleteHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        if (data.status === StatusEnum.REJECTED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'error',
                },
            } as SnackbarNotification;
            const removeIntegrationByCorrelationIdAction = undoPendingDeleteUserByCorrelationId(data.correlationId);
            ReduxStore.getStore().dispatch(removeIntegrationByCorrelationIdAction);
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        } else if (data.status === StatusEnum.COMPLETED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const removePendingDeleteIntegrationByCorrelationIdAction = removePendingDeleteUserByCorrelationId(data.correlationId);
            ReduxStore.getStore().dispatch(removePendingDeleteIntegrationByCorrelationIdAction);
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        }
    }
}
