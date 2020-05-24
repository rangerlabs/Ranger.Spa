import ISubscriptionLimitDetails from '../../models/app/ISubscriptionLimitDetails';

export const POPULATE_SUBSCRIPTION_LIMIT_DETAILS = 'POPULATE_SUBSCRIPTION_LIMIT_DETAILS';
export const UNLOAD_SUBSCRIPTION_LIMIT_DETAILS = 'UNLOAD_SUBSCRIPTION_LIMIT_DETAILS';

export interface SubscriptionLimitDetailsAction {
    type: string;
    subscriptionLimitDetailsState: SubscriptionLimitDetailsState;
}

export interface SubscriptionLimitDetailsState {
    subscriptionLimitDetails: ISubscriptionLimitDetails;
    isLoaded: boolean;
}

export function unloadSubscriptionLimitDetails(): SubscriptionLimitDetailsAction {
    return {
        type: UNLOAD_SUBSCRIPTION_LIMIT_DETAILS,
        subscriptionLimitDetailsState: {
            isLoaded: false,
            subscriptionLimitDetails: {} as ISubscriptionLimitDetails,
        },
    };
}

export function populateSubscriptionLimitDetails(subscriptionLimitDetails: ISubscriptionLimitDetails): SubscriptionLimitDetailsAction {
    return {
        type: POPULATE_SUBSCRIPTION_LIMIT_DETAILS,
        subscriptionLimitDetailsState: {
            isLoaded: true,
            subscriptionLimitDetails,
        },
    };
}
