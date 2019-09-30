import { MergedIntegrationResponseType } from '../../models/app/integrations/MergedIntegrationTypes';

export const ADD_INTEGRATION = 'ADD_INTEGRATION';
export const REMOVE_INTEGRATION = 'REMOVE_INTEGRATION';
export const POPULATE_INTEGRATIONS = 'POPULATE_INTEGRATIONS';

export interface IntegrationAction {
    type: string;
    integration: MergedIntegrationResponseType;
}

export interface IntegrationArrayAction {
    type: string;
    integrations: Array<MergedIntegrationResponseType>;
}

export function addIntegration(integration: MergedIntegrationResponseType): IntegrationAction {
    return {
        type: ADD_INTEGRATION,
        integration,
    };
}
export function removeIntegration(name: string): IntegrationAction {
    return {
        type: REMOVE_INTEGRATION,
        integration: { name: name } as MergedIntegrationResponseType,
    };
}
export function populateIntegrations(integrations: Array<MergedIntegrationResponseType>): IntegrationArrayAction {
    return {
        type: POPULATE_INTEGRATIONS,
        integrations,
    };
}
