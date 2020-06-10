import {
    OrganizationAction,
    SET_DOMAIN,
    OrganizationState,
    ADD_PENDING_PRIMARY_OWNER_TRANSFER,
    REMOVE_PENDING_PRIMARY_OWNER_TRANSFER,
    POPULATE_ORGANIZATION_NAME,
} from '../actions/OrganizationActions';

export function organizationReducer(state: OrganizationState = {} as OrganizationState, action: OrganizationAction) {
    switch (action.type) {
        case SET_DOMAIN:
            return Object.assign({}, state, action.domain);
        case POPULATE_ORGANIZATION_NAME:
            return Object.assign({}, state, action.domain);
        case ADD_PENDING_PRIMARY_OWNER_TRANSFER:
        case REMOVE_PENDING_PRIMARY_OWNER_TRANSFER:
            return Object.assign({}, state, action.domain);
        default:
            return state;
    }
}
