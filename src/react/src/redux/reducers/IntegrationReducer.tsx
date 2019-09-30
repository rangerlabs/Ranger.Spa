import { ADD_INTEGRATION, REMOVE_INTEGRATION, POPULATE_INTEGRATIONS, IntegrationAction, IntegrationArrayAction } from '../actions/IntegrationActions';
import { MergedIntegrationResponseType } from '../../models/app/integrations/MergedIntegrationTypes';

export function integrationReducer(state: MergedIntegrationResponseType[] = [], action: IntegrationAction & IntegrationArrayAction) {
    switch (action.type) {
        case ADD_INTEGRATION:
            return state.concat(action.integration);
        case REMOVE_INTEGRATION:
            return state.filter((v: MergedIntegrationResponseType) => v.name !== action.integration.name);
        case POPULATE_INTEGRATIONS:
            return action.integrations;
        default:
            return state;
    }
}
