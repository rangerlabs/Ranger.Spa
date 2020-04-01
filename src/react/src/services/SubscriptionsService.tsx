import RestUtilities, { IRestResponse } from './RestUtilities';
import IHostedPageUrl from '../models/app/IHostedPageUrl';
import IPlanId from '../models/app/IPlanId';

export default class SubscriptionsService {
    async getCheckoutExistingHostedPageUrl(planId: string): Promise<IRestResponse<IHostedPageUrl>> {
        return RestUtilities.get<IHostedPageUrl>(`/subscriptions/checkout-existing-hosted-page-url?planId=${planId}`);
    }
    async getSubscriptionPlanId(): Promise<IRestResponse<IPlanId>> {
        return RestUtilities.get<IPlanId>('/subscriptions/plan-id');
    }
}
