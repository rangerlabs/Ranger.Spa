import { ADD_INTEGRATION, REMOVE_INTEGRATION, POPULATE_INTEGRATIONS, IntegrationAction, IntegrationArrayAction } from "../actions/IntegrationActions";
import { MergedIntegrationType } from "../../models/app/integrations/MergedIntegrationType";

export function integrationReducer(state: MergedIntegrationType[] = [], action: IntegrationAction & IntegrationArrayAction) {
    switch (action.type) {
        case ADD_INTEGRATION:
            return state.concat(action.integration);
        case REMOVE_INTEGRATION:
            return state.filter((v: MergedIntegrationType) => v.name !== action.integration.name);
        case POPULATE_INTEGRATIONS:
            return action.integrations;
        default:
            return state;
    }
}
