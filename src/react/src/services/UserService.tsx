import RestUtilities, { IRestResponse } from './RestUtilities';
import IUser from '../models/app/IUser';
import IResetPasswordModel from '../models/landing/IPasswordResetModel';
import IChangeEmailModel from '../models/landing/IChangeEmailModel';
import IAccountUpdateModel from '../models/app/IAccountUpdateModel';
import ITransferPrimaryOwnershipModel from '../models/landing/ITransferPrimaryOwnershipModel';

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

    async updateAccount(accountUpdateModel: IAccountUpdateModel): Promise<IRestResponse<void>> {
        return RestUtilities.put(`/account`, accountUpdateModel);
    }

    async transferPrimaryOwnership(transferPrimaryOwnershipModel: ITransferOwnershipModel): Promise<IRestResponse<void>> {
        return RestUtilities.post('/account/transfer-primary-ownership', transferPrimaryOwnershipModel);
    }

    async deleteAccount(accountDeleteModel: IAccountDeleteModel): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/account`, accountDeleteModel);
    }

    async cancelPrimaryOwnershipTransfer(transferPrimaryOwnershipModel: ITransferPrimaryOwnershipModel): Promise<IRestResponse<void>> {
        return RestUtilities.post(`/account/cancel-ownership-transfer `, transferPrimaryOwnershipModel);
    }

    async acceptPrimaryOwnership(transferPrimaryOwnershipModel: ITransferPrimaryOwnershipModel): Promise<IRestResponse<boolean>> {
        return RestUtilities.post(`/account/accept-primary-ownership`, transferPrimaryOwnershipModel);
    }

    async refusePrimaryOwnership(transferPrimaryOwnershipModel: ITransferPrimaryOwnershipModel): Promise<IRestResponse<boolean>> {
        return RestUtilities.post(`/account/refuse-primary-ownership`, transferPrimaryOwnershipModel);
    }

    async deleteUser(email: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/users/${email}`);
    }

    async requestPasswordReset(passwordReset: IRequestPasswordResetModel): Promise<IRestResponse<boolean>> {
        return RestUtilities.put(`/users/password-reset`, passwordReset);
    }

    async requestEmailChanage(emailChange: IRequestEmailChangeModel): Promise<IRestResponse<boolean>> {
        return RestUtilities.put(`/users/email-change`, emailChange);
    }

    async changeEmail(resetModel: IChangeEmailModel): Promise<IRestResponse<void>> {
        return RestUtilities.post(`/users/email-change`, resetModel);
    }
}
