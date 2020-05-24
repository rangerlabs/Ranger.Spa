import {
    SubscriptionLimitDetailsState,
    SubscriptionLimitDetailsAction,
    POPULATE_SUBSCRIPTION_LIMIT_DETAILS,
    UNLOAD_SUBSCRIPTION_LIMIT_DETAILS,
} from '../actions/SubscriptionLimitDetailsActions';
import ISubscriptionLimitDetails from '../../models/app/ISubscriptionLimitDetails';

export function subscriptionLimitDetailsReducer(
    state: SubscriptionLimitDetailsState = { isLoaded: false, subscriptionLimitDetails: {} as ISubscriptionLimitDetails },
    action: SubscriptionLimitDetailsAction
) {
    switch (action.type) {
        case POPULATE_SUBSCRIPTION_LIMIT_DETAILS:
            return Object.assign({}, state, action.subscriptionLimitDetailsState);
        case UNLOAD_SUBSCRIPTION_LIMIT_DETAILS:
            return Object.assign({}, state, { isLoaded: action.subscriptionLimitDetailsState.isLoaded });
        default:
            return state;
    }
}
