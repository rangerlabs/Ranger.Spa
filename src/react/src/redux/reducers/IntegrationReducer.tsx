import {
    ADD_INTEGRATION,
    REMOVE_INTEGRATION,
    POPULATE_INTEGRATIONS,
    IntegrationAction,
    IntegrationArrayAction,
    IntegrationsState,
} from '../actions/IntegrationActions';
import { MergedIntegrationResponseType } from '../../models/app/integrations/MergedIntegrationTypes';

export function integrationReducer(state: IntegrationsState = { isLoaded: false, integrations: [] }, action: IntegrationAction & IntegrationArrayAction) {
    switch (action.type) {
        case ADD_INTEGRATION:
            return Object.assign({}, state, { integrations: state.integrations.concat(action.integration) });
        case REMOVE_INTEGRATION:
            return Object.assign({}, state, {
                integrations: state.integrations.filter((v: MergedIntegrationResponseType) => v.name !== action.integration.name),
            });
        case POPULATE_INTEGRATIONS:
            return Object.assign({}, state, action.integrationsState);
        default:
            return state;
    }
}
