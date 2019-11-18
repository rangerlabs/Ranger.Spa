import RestUtilities, { IRestResponse } from './RestUtilities';
import IUser from '../models/app/IUser';
import Logger from './Logger/Logger';
import IConfirmModel from '../models/landing/IConfirmModel';
import IPasswordResetModel from '../models/landing/IPasswordResetModel';

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

    async confirm(userId: string, confirmModel: IConfirmModel): Promise<boolean> {
        return RestUtilities.put(`/user/${userId}/confirm`, confirmModel).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }
    async resetPassword(userId: string, resetModel: IPasswordResetModel): Promise<boolean> {
        return RestUtilities.post(`/user/${userId}/password-reset`, resetModel).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }
}
