import UserManager from '../../../services/UserManager';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import ReduxStore from '../../../ReduxStore';
import PusherNotificationModel from '../../../models/PusherNotificationModel';

export default function PermissionsUpdatedHandler(data: PusherNotificationModel): void {
    UserManager.signinSilent()
        .then(() => {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        })
        .catch(() => {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        });
}
