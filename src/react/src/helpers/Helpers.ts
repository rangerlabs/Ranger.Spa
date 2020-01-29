import { MergedIntegrationType } from '../models/app/integrations/MergedIntegrationTypes';
import { RoleEnum } from '../models/RoleEnum';
import { UserProfile } from '../models/UserProfile';
import { User } from 'oidc-client';

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

export function getIntegrationsFromIntegrationIds(integrationIds: string[], integrations: MergedIntegrationType[]) {
    const integrationArray = [] as MergedIntegrationType[];
    integrationIds.map(id => {
        const integration = integrations.find(i => i.id === id);
        if (integration) {
            integrationArray.push(integration);
        }
    });
    return integrationArray;
}

export function userIsInRole(user: User, role: RoleEnum) {
    if (user) {
        if (Array.isArray((user.profile as UserProfile).role)) {
            return ((user.profile as UserProfile).role as string[]).find(r => r.toUpperCase() === role.toUpperCase());
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
        if (roles.find(r => r === RoleEnum.PRIMARY_OWNER)) {
            return RoleEnum.PRIMARY_OWNER;
        } else if (roles.find(r => r === RoleEnum.OWNER)) {
            return RoleEnum.OWNER;
        } else if (roles.find(r => r === RoleEnum.ADMIN)) {
            return RoleEnum.ADMIN;
        } else {
            return RoleEnum.USER;
        }
    } else {
        return roles;
    }
}
