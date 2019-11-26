export enum RoleEnum {
    USER = 'User',
    ADMIN = 'Admin',
    OWNER = 'Owner',
    TENANT_OWNER = 'TenantOwner',
}

export function GetRole(roles: string[]) {
    if (roles.find(r => r === RoleEnum.TENANT_OWNER)) {
        return RoleEnum.TENANT_OWNER;
    } else if (roles.find(r => r === RoleEnum.OWNER)) {
        return RoleEnum.OWNER;
    } else if (roles.find(r => r === RoleEnum.ADMIN)) {
        return RoleEnum.ADMIN;
    } else {
        return RoleEnum.USER;
    }
}

export function GetCascadedRoles(role: RoleEnum): RoleEnum[] {
    var roles = new Array<RoleEnum>();
    if (role === RoleEnum.TENANT_OWNER) {
        roles.push(RoleEnum.TENANT_OWNER);
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
