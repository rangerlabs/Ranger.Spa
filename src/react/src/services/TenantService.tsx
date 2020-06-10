import RestUtilities, { IRestResponse } from './RestUtilities';
import IReviewForm from '../models/landing/IReviewForm';
import IConfirmModel from '../models/landing/IConfirmModel';
import { PendingPrimaryOwnerTransfer } from '../models/app/PendingPrimaryOwnerTransfer';
import IOrganizationForm from '../models/IOrganizationForm';

export enum DomainEnabledResults {
    Enabled,
    Disabled,
    NotFound,
}

export default class TenantService {
    async exists(domain: string): Promise<IRestResponse<boolean>> {
        return RestUtilities.get(`/tenants/${domain}/exists`);
    }

    async getOrganizationName(domain: string): Promise<IRestResponse<IOrganizationForm>> {
        return RestUtilities.get(`/tenants/${domain}`);
    }

    async getPrimaryOwnerTransfer(domain: string): Promise<IRestResponse<PendingPrimaryOwnerTransfer>> {
        return RestUtilities.get<PendingPrimaryOwnerTransfer>(`/tenants/${domain}/primary-owner-transfer`);
    }

    async deleteOrganization(domain: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/tenants/{domain}`);
    }

    async confirmed(domain: string): Promise<IRestResponse<boolean>> {
        return RestUtilities.get<boolean>(`/tenants/${domain}/confirmed`);
    }

    async confirm(domain: string, confirmModel: IConfirmModel): Promise<IRestResponse<boolean>> {
        return RestUtilities.put(`/tenants/${domain}/confirm`, confirmModel);
    }

    async post(reviewForm: IReviewForm): Promise<IRestResponse<void>> {
        return RestUtilities.post('/tenants', reviewForm);
    }
}
