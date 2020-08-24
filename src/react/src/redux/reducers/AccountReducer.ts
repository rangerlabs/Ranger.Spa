import { AccountAction, SET_DELETING_ACCOUNT } from '../actions/AccountActions';

export function accountReducer(state = { isDeleting: false }, action: AccountAction) {
    switch (action.type) {
        case SET_DELETING_ACCOUNT: {
            return Object.assign({}, state, { isDeleting: action.accountState.isDeleting });
        }
        default:
            return state;
    }
}
