import {
    IntegrationAction,
    IntegrationsState,
    IntegrationArrayAction,
    ADD_INTEGRATION,
    UPDATE_INTEGRATION_BY_CORRELATION_ID,
    UPDATE_INTEGRATION_BY_ID,
    UNDO_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID,
    REMOVE_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID,
    UNDO_PENDING_UPDATE_INTEGRATION_BY_CORRELATION_ID,
    REMOVE_PENDING_UPDATE_INTEGRATION_BY_ID,
    ADD_INTEGRATION_TO_PENDING_DELETION,
    ADD_INTEGRATION_TO_PENDING_UPDATE,
    REMOVE_INTEGRATION_BY_NAME,
    REMOVE_INTEGRATION_BY_CORRELATION_ID,
    POPULATE_INTEGRATIONS,
    RESET_INTEGATIONS,
} from '../actions/IntegrationActions';
import Integration from '../../models/app/integrations/Integration';

export function integrationReducer(
    state: IntegrationsState = { isLoaded: false, integrations: [], pendingUpdate: [], pendingDeletion: [] },
    action: IntegrationAction & IntegrationArrayAction
) {
    switch (action.type) {
        case ADD_INTEGRATION: {
            return Object.assign({}, state, { integrations: state.integrations.concat(action.integration) });
        }
        case UPDATE_INTEGRATION_BY_CORRELATION_ID: {
            var integrationIndex = state.integrations.findIndex((g) => g.correlationModel?.correlationId === action.integration.correlationModel.correlationId);
            var updatedIntegration = state.integrations[integrationIndex];
            updatedIntegration.correlationModel.status = action.integration.correlationModel.status;
            updatedIntegration.id = action.integration.correlationModel.resourceId;
            let newArray = state.integrations.slice();
            newArray.splice(integrationIndex, 1, updatedIntegration);
            return Object.assign({}, state, { integrations: newArray });
        }
        case UPDATE_INTEGRATION_BY_ID: {
            {
                const integrationIndex = state.integrations.findIndex((g) => g.id == action.integration.id);
                let newArray = state.integrations.slice();
                newArray.splice(integrationIndex, 1, action.integration);
                return Object.assign({}, state, { integrations: newArray });
            }
        }
        case UNDO_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID: {
            const integrationToRestore = state.pendingDeletion.find(
                (v: Integration) => v.correlationModel.correlationId === action.integration.correlationModel.correlationId
            );
            return Object.assign({}, state, {
                integrations: state.integrations.concat(integrationToRestore),
                pendingDeletion: state.pendingDeletion.filter(
                    (v: Integration) => v.correlationModel.correlationId !== action.integration.correlationModel.correlationId
                ),
            });
        }
        case REMOVE_PENDING_DELETE_INTEGRATION_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.filter(
                    (v: Integration) => v.correlationModel.correlationId !== action.integration.correlationModel.correlationId
                ),
            });
        }
        case UNDO_PENDING_UPDATE_INTEGRATION_BY_CORRELATION_ID: {
            const idToRestore = state.integrations.find(
                (v: Integration) => v.correlationModel?.correlationId === action.integration.correlationModel.correlationId
            ).id;
            const integrationToRestore = state.pendingUpdate.find((v: Integration) => v.id === idToRestore);
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v: Integration) => v.id !== idToRestore),
                integrations: state.integrations.filter((v: Integration) => v.id !== idToRestore).concat(integrationToRestore),
            });
        }
        case REMOVE_PENDING_UPDATE_INTEGRATION_BY_ID: {
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v: Integration) => v.id !== action.integration.id),
            });
        }
        case ADD_INTEGRATION_TO_PENDING_DELETION: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.concat(action.integration),
            });
        }
        case ADD_INTEGRATION_TO_PENDING_UPDATE: {
            return Object.assign({}, state, { pendingUpdate: state.pendingDeletion.concat(action.integration) });
        }
        case REMOVE_INTEGRATION_BY_NAME: {
            return Object.assign({}, state, {
                integrations: state.integrations.filter((v: Integration) => v.name !== action.integration.name),
            });
        }
        case REMOVE_INTEGRATION_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                integrations: state.integrations.filter(
                    (v: Integration) => v.correlationModel?.correlationId !== action.integration.correlationModel.correlationId
                ),
            });
        }
        case POPULATE_INTEGRATIONS: {
            return Object.assign({}, state, action.integrationsState);
        }
        case RESET_INTEGATIONS: {
            return Object.assign({}, state, action.integrationsState);
        }
        default:
            return state;
    }
}
