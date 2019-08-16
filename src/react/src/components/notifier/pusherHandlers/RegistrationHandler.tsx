import ReduxStore from "../../../ReduxStore";
import { StatusEnum } from "../../../models/StatusEnum";
import { DomainState } from "../../../redux/actions/DomainActions";
import { SnackbarNotification, enqueueSnackbar } from "../../../redux/actions/SnackbarActions";

export default function RegistrationHandler(data: DomainState): void {
    const domain = ReduxStore.getState().domain;
    if (domain && domain.status === StatusEnum.PENDING) {
        if (data.domain === domain.domain && domain.correlationId === data.correlationId) {
            let snackbarNotification = undefined as SnackbarNotification;
            if (data.status === StatusEnum.REJECTED) {
                snackbarNotification = {
                    message: "Domain request rejected. Check your email for more details.",
                    options: {
                        variant: "error",
                    },
                } as SnackbarNotification;
                const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
                ReduxStore.getStore().dispatch(enqueueSnackbarAction);
            } else if (data.status === StatusEnum.COMPLETED) {
                snackbarNotification = {
                    message: "Domain request complete. Check your email to complete your registration.",
                    options: {
                        variant: "success",
                    },
                } as SnackbarNotification;
                const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
                ReduxStore.getStore().dispatch(enqueueSnackbarAction);
            }
        }
    }
}
