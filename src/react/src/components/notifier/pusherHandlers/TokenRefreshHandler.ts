import UserManager from '../../../services/UserManager';

export default function TokenRefreshHandler(): void {
    UserManager.signinSilent();
}
