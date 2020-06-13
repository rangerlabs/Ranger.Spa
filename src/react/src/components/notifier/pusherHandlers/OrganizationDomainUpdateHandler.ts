import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import UserManager from '../../../services/UserManager';
import { DialogContent, openDialog } from '../../../redux/actions/DialogActions';

export default function OrganizationDomainUpdateHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;
    const idTokenHint = ReduxStore.getState().oidc.user.id_token;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        var openDialogAction = openDialog(
            new DialogContent(data.message, 'Domain update', 'Ok', () => UserManager.signoutRedirect({ id_token_hint: idTokenHint }))
        );
        const store = ReduxStore.getStore();
        store.dispatch(openDialogAction);
    }
}
