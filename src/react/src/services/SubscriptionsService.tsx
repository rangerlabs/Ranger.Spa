import RestUtilities, { IRestResponse } from './RestUtilities';
import IHostedPageUrl from '../models/app/IHostedPageUrl';
import IPlanId from '../models/app/IPlanId';
import ISubscriptionLimitDetails from '../models/app/ISubscriptionLimitDetails';
import IPortalSession from '../models/app/IPortalSession';

export default class SubscriptionsService {
    async getCheckoutExistingHostedPageUrl(planId: string): Promise<IRestResponse<IHostedPageUrl>> {
        return RestUtilities.get<IHostedPageUrl>(`/subscriptions/checkout-existing-hosted-page-url?planId=${planId}`);
    }
    async getPortalSession(): Promise<IRestResponse<IPortalSession>> {
        return RestUtilities.get<IPortalSession>(`/subscriptions/portal-session`);
    }
    async getSubscriptionPlanId(): Promise<IRestResponse<IPlanId>> {
        return RestUtilities.get<IPlanId>('/subscriptions/plan-id');
    }
    async getSubscriptionLimitDetails(): Promise<IRestResponse<ISubscriptionLimitDetails>> {
        return RestUtilities.get<ISubscriptionLimitDetails>('/subscriptions');
    }
}
