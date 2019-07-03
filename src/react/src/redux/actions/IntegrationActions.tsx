import { MergedIntegrationType } from "../../models/app/integrations/MergedIntegrationType";

export const ADD_INTEGRATION = "ADD_INTEGRATION";
export const REMOVE_INTEGRATION = "REMOVE_INTEGRATION";
export const POPULATE_INTEGRATIONS = "POPULATE_INTEGRATIONS";

export interface IntegrationAction {
    type: string;
    integration: MergedIntegrationType;
}

export interface IntegrationArrayAction {
    type: string;
    integrations: Array<MergedIntegrationType>;
}

export function addIntegration(integration: MergedIntegrationType): IntegrationAction {
    return {
        type: ADD_INTEGRATION,
        integration,
    };
}
export function removeIntegration(name: string): IntegrationAction {
    return {
        type: REMOVE_INTEGRATION,
        integration: { name: name } as MergedIntegrationType,
    };
}
export function populateIntegrations(integrations: Array<MergedIntegrationType>): IntegrationArrayAction {
    return {
        type: POPULATE_INTEGRATIONS,
        integrations,
    };
}
