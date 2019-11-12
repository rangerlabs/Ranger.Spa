import { StatusEnum } from '../StatusEnum';

export default interface IUser {
    lastName: string;
    firstName: string;
    email: string;
    role: string;
    authorizedProjects: string[];
    status: StatusEnum;
}
