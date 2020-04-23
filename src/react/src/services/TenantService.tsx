import RestUtilities, { IRestResponse } from './RestUtilities';
import IReviewForm from '../models/landing/IReviewForm';
import IEnabledModel from '../models/landing/IEnabledModel';
import IConfirmModel from '../models/landing/IConfirmModel';
import ReduxStore from '../ReduxStore';
import { enqueueSnackbar, SnackbarNotification } from '../redux/actions/SnackbarActions';
import { PendingPrimaryOwnerTransfer } from '../models/app/PendingPrimaryOwnerTransfer';

export enum DomainEnabledResults {
    Enabled,
    Disabled,
    NotFound,
}

export default class TenantService {
    async exists(domain: string): Promise<boolean> {
        return RestUtilities.get(`/tenants/${domain}/exists`).then((value) => {
            if (value.isError) {
                return false;
            }
            return Boolean(value.result);
        });
    }

    async getPrimaryOwnerTransfer(domain: string): Promise<IRestResponse<PendingPrimaryOwnerTransfer>> {
        return RestUtilities.get<PendingPrimaryOwnerTransfer>(`/tenants/${domain}/primary-owner-transfer`);
    }

    async deleteDomain(domain: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/tenants/{domain}`);
    }

    async enabled(domain: string): Promise<DomainEnabledResults> {
        return RestUtilities.get<IEnabledModel>(`/tenants/${domain}/enabled`).then((value) => {
            if (value.isError) {
                return DomainEnabledResults.NotFound;
            }
            if (value.result.enabled) {
                return DomainEnabledResults.Enabled;
            }
            return DomainEnabledResults.Disabled;
        });
    }

    async confirm(domain: string, confirmModel: IConfirmModel): Promise<boolean> {
        return RestUtilities.put(`/tenants/${domain}/confirm`, confirmModel).then((value) => {
            if (value.isError) {
                return false;
            }
            return true;
        });
    }

    async post(reviewForm: IReviewForm): Promise<boolean> {
        return RestUtilities.post('/tenants', reviewForm).then((value) => {
            const result = !value.isError;
            if (result) {
                const snackbarNotification = {
                    message: 'Domain request accepted.',
                } as SnackbarNotification;
                const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
                ReduxStore.getStore().dispatch(enqueueSnackbarAction);
            }
            return result;
        });
    }
}
