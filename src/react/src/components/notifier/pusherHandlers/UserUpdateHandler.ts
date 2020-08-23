import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import { undoPendingUpdateUserByCorrelationId, updateUserByCorrelationId, removePendingUpdateUserById } from '../../../redux/actions/UserActions';

export default function UserUpdateHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        if (data.status === StatusEnum.REJECTED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'error',
                },
            } as SnackbarNotification;
            const undoPendingUpdateIntegrationByCorrelationIdAction = undoPendingUpdateUserByCorrelationId(data.correlationId);
            ReduxStore.getStore().dispatch(undoPendingUpdateIntegrationByCorrelationIdAction);
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        } else if (data.status === StatusEnum.COMPLETED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const updateIntegrationByCorrelationIdAction = updateUserByCorrelationId({
                correlationId: data.correlationId,
                status: data.status,
                resourceId: data.resourceId,
            });
            const removePendingUpdateIntegrationByCorrelationIdAction = removePendingUpdateUserById(data.resourceId);
            ReduxStore.getStore().dispatch(removePendingUpdateIntegrationByCorrelationIdAction);
            ReduxStore.getStore().dispatch(updateIntegrationByCorrelationIdAction);
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        }
    }
}
