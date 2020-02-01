import { createUserManager } from 'redux-oidc';
import { UserManagerSettings } from 'oidc-client';
import { getSubDomain } from '../helpers/Helpers';

const UserManagerConfig: UserManagerSettings = {
    client_id: 'react',
    authority: getAuthority(),
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: 'openid profile apiGateway',
    automaticSilentRenew: true,
    silent_redirect_uri: getSilentRedirectUri(),
    filterProtocolClaims: true,
    loadUserInfo: true,
    monitorSession: true,
    extraQueryParams: getSubDomain(),
};

function getAuthority(): string {
    let authority = 'https://' + IDENTITY_AUTHORITY;
    const domain = getSubDomain();
    if (domain.length > 0) {
        authority = 'https://' + domain + '.' + IDENTITY_AUTHORITY;
    }
    return authority;
}

function getSilentRedirectUri(): string {
    let redirectUri = '';
    const domain = getSubDomain();
    if (domain.length > 0) {
        redirectUri = 'https://' + domain + '.' + SPA_HOST + '/silent-refresh.html';
    }
    return redirectUri;
}

function getRedirectUri(): string {
    let redirectUri = '';
    const domain = getSubDomain();
    if (domain.length > 0) {
        redirectUri = 'https://' + domain + '.' + SPA_HOST + '/callback';
    }
    return redirectUri;
}

const UserManager = createUserManager(UserManagerConfig);

export default UserManager;
