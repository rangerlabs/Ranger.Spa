import RestUtilities from './RestUtilities';
import IReviewForm from '../models/landing/IReviewForm';
import IEnabledModel from '../models/landing/IEnabledModel';
import IConfirmModel from '../models/landing/IConfirmModel';
import ReduxStore from '../ReduxStore';
import { enqueueSnackbar, SnackbarNotification } from '../redux/actions/SnackbarActions';

export enum DomainEnabledResults {
    Enabled,
    Disabled,
    NotFound,
}

export default class TenantService {
    async exists(domain: string): Promise<boolean> {
        return RestUtilities.get(`/tenants/${domain}/exists`).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }

    async enabled(domain: string): Promise<DomainEnabledResults> {
        return RestUtilities.get<IEnabledModel>(`/tenants/${domain}/enabled`).then(value => {
            if (value.is_error) {
                return DomainEnabledResults.NotFound;
            }
            if (value.content.enabled) {
                return DomainEnabledResults.Enabled;
            }
            return DomainEnabledResults.Disabled;
        });
    }

    async confirm(domain: string, confirmModel: IConfirmModel): Promise<boolean> {
        return RestUtilities.put(`/tenants/${domain}/confirm`, confirmModel).then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }

    async post(reviewForm: IReviewForm): Promise<boolean> {
        return RestUtilities.post('/tenants', reviewForm).then(value => {
            const result = !value.is_error;
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
