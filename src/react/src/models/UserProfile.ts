export type UserProfile = {
    auth_time: number;
    domain: string;
    email: string;
    firstName: string;
    idp: string;
    lastName: string;
    role: string | string[];
    authorizedProjects: string[];
    sid: string;
    sub: string;
};
