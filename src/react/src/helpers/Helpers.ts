import { MergedIntegrationType } from '../models/app/integrations/MergedIntegrationTypes';
import { RoleEnum } from '../models/RoleEnum';
import { UserProfile } from '../models/UserProfile';
import { User } from 'oidc-client';

export function getSpaVersion(): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; spa-version=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function getSubDomain(): string {
    let domain = '';
    if (window && window.location) {
        const host = window.location.host;
        if (host.split('.').length >= 3) {
            domain = host.split('.')[0];
        }
    }
    return domain;
}

export function getHost(): string {
    let host = '';
    if (window && window.location) {
        var subdomain = getSubDomain();
        if (subdomain) {
            return window.location.host.replace(new RegExp(`^${subdomain}\\.`), '');
        } else {
            return window.location.host;
        }
    }
}

export function getIntegrationsFromIntegrationIds(integrationIds: string[], integrations: MergedIntegrationType[]) {
    const integrationArray = [] as MergedIntegrationType[];
    integrationIds.map((id) => {
        const integration = integrations.find((i) => i.integrationId === id);
        if (integration) {
            integrationArray.push(integration);
        }
    });
    return integrationArray;
}

export function userIsInRole(user: User, role: RoleEnum) {
    if (user) {
        if (Array.isArray((user.profile as UserProfile).role)) {
            return ((user.profile as UserProfile).role as string[]).find((r) => r.toUpperCase() === role.toUpperCase());
        } else {
            return ((user.profile as UserProfile).role as string).toUpperCase() === role.toUpperCase();
        }
    }
    return false;
}

export function getCascadedRoles(role: string): RoleEnum[] {
    var roles = new Array<RoleEnum>();
    if (role === RoleEnum.PRIMARY_OWNER) {
        roles.push(RoleEnum.PRIMARY_OWNER);
        roles.push(RoleEnum.OWNER);
        roles.push(RoleEnum.ADMIN);
        roles.push(RoleEnum.USER);
    } else if (role === RoleEnum.OWNER) {
        roles.push(RoleEnum.OWNER);
        roles.push(RoleEnum.ADMIN);
        roles.push(RoleEnum.USER);
    } else if (role === RoleEnum.ADMIN) {
        roles.push(RoleEnum.ADMIN);
        roles.push(RoleEnum.USER);
    } else {
        roles.push(RoleEnum.USER);
    }
    return roles;
}

export function getRole(roles: string | string[]) {
    if (Array.isArray(roles)) {
        if (roles.find((r) => r === RoleEnum.PRIMARY_OWNER)) {
            return RoleEnum.PRIMARY_OWNER;
        } else if (roles.find((r) => r === RoleEnum.OWNER)) {
            return RoleEnum.OWNER;
        } else if (roles.find((r) => r === RoleEnum.ADMIN)) {
            return RoleEnum.ADMIN;
        } else {
            return RoleEnum.USER;
        }
    } else {
        return roles;
    }
}

export function scrollToLandingId(id: string) {
    const headerOffset = -64 * 2;
    var element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + headerOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}
