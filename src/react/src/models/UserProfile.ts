import { Profile } from 'oidc-client';

export interface UserProfile extends Profile {
    domain: string;
    role: string | string[];
    authorizedProjects: string[];
    sid: string;
    sub: string;
}
