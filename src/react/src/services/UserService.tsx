import RestUtilities, { IRestResponse } from './RestUtilities';
import IUser from '../models/app/IUser';
import IConfirmModel from '../models/landing/IConfirmModel';
import IResetPasswordModel from '../models/landing/IPasswordResetModel';
import IChangeEmailModel from '../models/landing/IChangeEmailModel';
import IAccountUpdateModel from '../models/app/IAccountUpdateModel';

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

    async putUser(email: string, updatedUser: IUser): Promise<IRestResponse<IUser>> {
        return RestUtilities.put<IUser>(`/user/${email}`, updatedUser);
    }

    async confirmUserAndPassword(email: string, confirmModel: IResetPasswordModel): Promise<IRestResponse<void>> {
        return RestUtilities.put(`/user/${email}/confirm`, confirmModel);
    }

    async getAuthorizedProjects(email: string): Promise<IRestResponse<string[]>> {
        return RestUtilities.get(`/user/${email}/authorized-projects`);
    }

    async resetPassword(email: string, resetModel: IResetPasswordModel): Promise<IRestResponse<void>> {
        return RestUtilities.post(`/user/${email}/password-reset`, resetModel);
    }

    async updateAccount(email: string, accountUpdateModel: IAccountUpdateModel): Promise<IRestResponse<void>> {
        return RestUtilities.put(`/account/${email}`, accountUpdateModel);
    }

    async deleteAccount(email: string, accountDeleteModel: IAccountDeleteModel): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/account/${email}`, accountDeleteModel);
    }

    async deleteUser(email: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/user/${email}`);
    }

    async requestPasswordReset(userEmail: string, passwordReset: IRequestPasswordResetModel): Promise<boolean> {
        return RestUtilities.put(`/user/${userEmail}/password-reset`, passwordReset).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }

    async requestEmailChanage(currentUserEmail: string, emailChange: IRequestEmailChangeModel): Promise<boolean> {
        return RestUtilities.put(`/user/${currentUserEmail}/email-change`, emailChange).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }

    async changeEmail(email: string, resetModel: IChangeEmailModel): Promise<IRestResponse<void>> {
        return RestUtilities.post(`/user/${email}/email-change`, resetModel);
    }
}
