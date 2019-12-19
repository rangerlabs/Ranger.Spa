import UserManager from '../../../services/UserManager';
import ReduxStore from '../../../ReduxStore';

export default function ForceSignoutHandler(): void {
    const idTokenHint = ReduxStore.getState().oidc.user.id_token;
    UserManager.signoutRedirect({ id_token_hint: idTokenHint });
}
