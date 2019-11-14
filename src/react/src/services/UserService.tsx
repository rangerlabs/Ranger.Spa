import RestUtilities, { IRestResponse } from './RestUtilities';
import IUser from '../models/app/IUser';
import Logger from './Logger/Logger';
import IConfirmModel from '../models/landing/IConfirmModel';

export default class UserService {
    async getUsers(): Promise<IRestResponse<IUser[]>> {
        return RestUtilities.get<IUser[]>('/user/all');
    }

    async getUser(email: string): Promise<IRestResponse<IUser>> {
        return RestUtilities.get<IUser>('/user?email=' + email);
    }

    async postUser(user: IUser): Promise<IRestResponse<IUser>> {
        return RestUtilities.post<IUser>('/user', user);
    }

    async confirm(confirmModel: IConfirmModel): Promise<boolean> {
        return RestUtilities.put(`/user/confirm`, confirmModel).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }
}
