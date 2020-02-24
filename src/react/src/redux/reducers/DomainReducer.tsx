import { DomainAction, ADD_DOMAIN, DomainState, ADD_PENDING_PRIMARY_OWNER_TRANSFER, REMOVE_PENDING_PRIMARY_OWNER_TRANSFER } from '../actions/DomainActions';

export function domainReducer(state: DomainState = {} as DomainState, action: DomainAction) {
    switch (action.type) {
        case ADD_DOMAIN:
            return Object.assign({}, state, action.domain);
        case ADD_PENDING_PRIMARY_OWNER_TRANSFER:
        case REMOVE_PENDING_PRIMARY_OWNER_TRANSFER:
            return Object.assign({}, state, action.domain);
        default:
            return state;
    }
}
