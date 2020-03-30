import RestUtilities, { IRestResponse } from './RestUtilities';

export default class SubscriptionsService {
    async getCheckoutExistingHostedPageUrl(): Promise<IRestResponse<any>> {
        return RestUtilities.get<any>('/subscriptions/checkout-existing-hosted-page-url');
    }
}
