import RestUtilities, { IRestResponse } from './RestUtilities';
import IUser from '../models/app/IUser';
import IConfirmModel from '../models/landing/IConfirmModel';
import IResetPasswordModel from '../models/landing/IPasswordResetModel';
import IChangeEmailModel from '../models/landing/IChangeEmailModel';
import IAccountUpdateModel from '../models/app/IAccountUpdateModel';

export default class UserService {
    async getUsers(): Promise<IRestResponse<IUser[]>> {
        return RestUtilities.get<IUser[]>('/users');
    }

    async getUser(email: string): Promise<IRestResponse<IUser>> {
        return RestUtilities.get<IUser>(`/users/${email}`);
    }

    async postUser(user: IUser): Promise<IRestResponse<IUser>> {
        return RestUtilities.post<IUser>('/users', user);
    }

    async putUser(email: string, updatedUser: IUser): Promise<IRestResponse<IUser>> {
        return RestUtilities.put<IUser>(`/users/${email}`, updatedUser);
    }

    async confirmUserAndPassword(email: string, confirmModel: IResetPasswordModel): Promise<IRestResponse<void>> {
        return RestUtilities.put(`/users/${email}/confirm`, confirmModel);
    }

    async getAuthorizedProjects(email: string): Promise<IRestResponse<string[]>> {
        return RestUtilities.get(`/users/${email}/authorized-projects`);
    }

    async resetPassword(email: string, resetModel: IResetPasswordModel): Promise<IRestResponse<void>> {
        return RestUtilities.post(`/users/${email}/password-reset`, resetModel);
    }

    async updateAccount(email: string, accountUpdateModel: IAccountUpdateModel): Promise<IRestResponse<void>> {
        return RestUtilities.put(`/accounts/${email}`, accountUpdateModel);
    }

    async deleteAccount(email: string, accountDeleteModel: IAccountDeleteModel): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/accounts/${email}`, accountDeleteModel);
    }

    async deleteUser(email: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/users/${email}`);
    }

    async requestPasswordReset(userEmail: string, passwordReset: IRequestPasswordResetModel): Promise<boolean> {
        return RestUtilities.put(`/users/${userEmail}/password-reset`, passwordReset).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }

    async requestEmailChanage(currentUserEmail: string, emailChange: IRequestEmailChangeModel): Promise<boolean> {
        return RestUtilities.put(`/users/${currentUserEmail}/email-change`, emailChange).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }

    async changeEmail(email: string, resetModel: IChangeEmailModel): Promise<IRestResponse<void>> {
        return RestUtilities.post(`/users/${email}/email-change`, resetModel);
    }
}
