import { DomainAction, ADD_DOMAIN, DomainState } from "../actions/DomainActions";

export function domainReducer(state: DomainState = {} as DomainState, action: DomainAction) {
    switch (action.type) {
        case ADD_DOMAIN:
            return Object.assign({}, state, { domain: action.domain });
        default:
            return state;
    }
}
