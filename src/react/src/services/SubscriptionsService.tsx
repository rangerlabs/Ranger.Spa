import RestUtilities, { IRestResponse } from './RestUtilities';
import IHostedPageUrl from '../models/app/IHostedPageUrl';
import IPlanId from '../models/app/IPlanId';
import ISubscriptionLimitDetails from '../models/app/ISubscriptionLimitDetails';

export default class SubscriptionsService {
    async getCheckoutExistingHostedPageUrl(planId: string): Promise<IRestResponse<IHostedPageUrl>> {
        return RestUtilities.get<IHostedPageUrl>(`/subscriptions/checkout-existing-hosted-page-url?planId=${planId}`);
    }
    async getSubscriptionPlanId(): Promise<IRestResponse<IPlanId>> {
        return RestUtilities.get<IPlanId>('/subscriptions/plan-id');
    }
    async getSubscriptionLimitDetails(): Promise<IRestResponse<ISubscriptionLimitDetails>> {
        return RestUtilities.get<ISubscriptionLimitDetails>('/subscriptions');
    }
}
