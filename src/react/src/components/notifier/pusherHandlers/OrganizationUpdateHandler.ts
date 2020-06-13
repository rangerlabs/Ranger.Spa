import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { StatusEnum } from '../../../models/StatusEnum';
import TenantService from '../../../services/TenantService';
import { populateOrganization } from '../../../redux/actions/OrganizationActions';
const tenantService = new TenantService();

export default function OrganizationUpdateHandler(data: PusherNotificationModel): void {
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
            ReduxStore.getStore().dispatch(enqueueSnackbarAction);
        } else if (data.status === StatusEnum.COMPLETED) {
            const snackbarNotification = {
                message: data.message,
                options: {
                    variant: 'success',
                },
            } as SnackbarNotification;
            const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
            const store = ReduxStore.getStore();
            store.dispatch(enqueueSnackbarAction);
            tenantService.getOrganizationName(store.getState().organizationState.domain).then((organizationResponse) => {
                if (!organizationResponse.isError) {
                    const action = populateOrganization(organizationResponse.result.organizationName, organizationResponse.result.version);
                    store.dispatch(action);
                }
            });
        }
    }
}
