import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import UserManager from '../../../services/UserManager';
import { setAccountDeleting } from '../../../redux/actions/AccountActions';

export default function AccountDeleteHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        if (data.status === StatusEnum.REJECTED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'error',
                },
            } as SnackbarNotification;
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            const setIsDeleting = setAccountDeleting(false);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
            ReduxStore.getStore().dispatch(setIsDeleting);
        } else if (data.status === StatusEnum.COMPLETED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
            UserManager.signoutRedirect({ id_token_hint: oidcState.user.id_token });
        }
    }
}
