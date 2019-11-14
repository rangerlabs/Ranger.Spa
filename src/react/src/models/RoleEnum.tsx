export enum RoleEnum {
    USER = 'USER',
    ADMIN = 'ADMIN',
    OWNER = 'OWNER',
    TENANT_OWNER = 'TENANT_OWNER',
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
