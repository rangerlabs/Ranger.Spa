import ReduxStore from '../../../ReduxStore';
import { StatusEnum } from '../../../models/StatusEnum';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import PusherNotificationModel from '../../../models/PusherNotificationModel';

export default function RegistrationHandler(data: PusherNotificationModel): void {
    const domain = ReduxStore.getState().organizationState;
    if (domain && domain.status === StatusEnum.PENDING) {
        let snackbarNotification = undefined as SnackbarNotification;
        if (data.status === StatusEnum.REJECTED) {
            snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'error',
                },
            } as SnackbarNotification;
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        } else if (data.status === StatusEnum.COMPLETED) {
            snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        }
    }
}
