import { SubscriptionLimitDetailsState, SubscriptionLimitDetailsAction, POPULATE_SUBSCRIPTION_LIMIT_DETAILS } from '../actions/SubscriptionLimitDetailsActions';
import ISubscriptionLimitDetails from '../../models/app/ISubscriptionLimitDetails';

export function subscriptionLimitDetailsReducer(
    state: SubscriptionLimitDetailsState = { isLoaded: false, subscriptionLimitDetails: {} as ISubscriptionLimitDetails },
    action: SubscriptionLimitDetailsAction
) {
    switch (action.type) {
        case POPULATE_SUBSCRIPTION_LIMIT_DETAILS:
            return Object.assign({}, state, action.subscriptionLimitDetailsState);
        default:
            return state;
    }
}
