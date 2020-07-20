import { MergedIntegrationType } from '../../models/app/integrations/MergedIntegrationTypes';
import CorrelationModel from '../../models/CorrelationModel';

export const ADD_INTEGRATION = 'ADD_INTEGRATION';
export const POPULATE_INTEGRATIONS = 'POPULATE_INTEGRATIONS';

export const UPDATE_INTEGRATION_BY_CORRELATION_ID = 'UPDATE_INTEGRATION_BY_CORRELATION_ID';
export const UPDATE_INTEGRATION_BY_ID = 'UPDATE_INTEGRATION_BY_ID';
export const REMOVE_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID = 'REMOVE_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID';
export const UNDO_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID = 'UNDO_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID';
export const REMOVE_PENDING_UPDATE_INTEGRATION_BY_ID = 'REMOVE_PENDING_UPDATE_INTEGRATION_BY_ID';
export const UNDO_PENDING_UPDATE_INTEGRATION_BY_CORRELATION_ID = 'UNDO_PENDING_UPDATE_INTEGRATION_BY_CORRELATION_ID';
export const REMOVE_INTEGRATION_BY_CORRELATION_ID = 'REMOVE_INTEGRATION_BY_CORRELATION_ID';
export const ADD_INTEGRATION_TO_PENDING_DELETION = 'MOVE_INTEGRATION_TO_PENDING_DELETION';
export const ADD_INTEGRATION_TO_PENDING_UPDATE = 'ADD_INTEGRATION_TO_PENDING_UDPATE';
export const REMOVE_INTEGRATION_BY_NAME = 'REMOVE_INTEGRATION_BY_NAME';
export const RESET_INTEGATIONS = 'RESET_INTEGRATIONS';

export interface IntegrationAction {
    type: string;
    integration: MergedIntegrationType;
}

export interface IntegrationArrayAction {
    type: string;
    integrationsState: IntegrationsState;
}

export interface IntegrationsState {
    isLoaded: boolean;
    integrations: Array<MergedIntegrationType>;
    pendingUpdate: Array<MergedIntegrationType>;
    pendingDeletion: Array<MergedIntegrationType>;
}

export function addIntegration(integration: MergedIntegrationType): IntegrationAction {
    return {
        type: ADD_INTEGRATION,
        integration,
    };
}

export function updateIntegrationByCorrelationId(correlationModel: CorrelationModel) {
    return {
        type: UPDATE_INTEGRATION_BY_CORRELATION_ID,
        integration: { correlationModel: correlationModel } as MergedIntegrationType,
    };
}

export function updateIntegrationById(integration: MergedIntegrationType) {
    return {
        type: UPDATE_INTEGRATION_BY_ID,
        integration,
    };
}

export function removePendingDeleteIntegrationByCorrelationId(correlationId: string): IntegrationAction {
    return {
        type: REMOVE_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID,
        integration: { correlationModel: { correlationId: correlationId } as CorrelationModel } as MergedIntegrationType,
    };
}

export function undoPendingDeleteIntegrationByCorrelationId(correlationId: string): IntegrationAction {
    return {
        type: UNDO_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID,
        integration: { correlationModel: { correlationId: correlationId } as CorrelationModel } as MergedIntegrationType,
    };
}

export function removePendingUpdateIntegrationById(id: string): IntegrationAction {
    return {
        type: REMOVE_PENDING_UPDATE_INTEGRATION_BY_ID,
        integration: { integrationId: id } as MergedIntegrationType,
    };
}

export function undoPendingUpdateIntegrationByCorrelationId(correlationId: string): IntegrationAction {
    return {
        type: UNDO_PENDING_UPDATE_INTEGRATION_BY_CORRELATION_ID,
        integration: { correlationModel: { correlationId: correlationId } as CorrelationModel } as MergedIntegrationType,
    };
}

export function addIntegrationToPendingDeletion(integration: MergedIntegrationType): IntegrationAction {
    return {
        type: ADD_INTEGRATION_TO_PENDING_DELETION,
        integration,
    };
}

export function addIntegrationToPendingUpdate(integration: MergedIntegrationType): IntegrationAction {
    return {
        type: ADD_INTEGRATION_TO_PENDING_UPDATE,
        integration,
    };
}

export function removeIntegrationByName(name: string): IntegrationAction {
    return {
        type: REMOVE_INTEGRATION_BY_NAME,
        integration: { name: name } as MergedIntegrationType,
    };
}

export function removeIntegrationByCorrelationId(correlationId: string): IntegrationAction {
    return {
        type: REMOVE_INTEGRATION_BY_CORRELATION_ID,
        integration: { correlationModel: { correlationId: correlationId } as CorrelationModel } as MergedIntegrationType,
    };
}

export function populateIntegrations(integrations: Array<MergedIntegrationType>): IntegrationArrayAction {
    return {
        type: POPULATE_INTEGRATIONS,
        integrationsState: {
            isLoaded: true,
            integrations,
            pendingUpdate: [],
            pendingDeletion: [],
        },
    };
}

export function resetIntegrations(): IntegrationArrayAction {
    return {
        type: RESET_INTEGATIONS,
        integrationsState: {
            isLoaded: false,
            integrations: [],
            pendingUpdate: [],
            pendingDeletion: [],
        },
    };
}
