import {
    POPULATE_GEOFENCES,
    GeofenceAction,
    GeofenceArrayAction,
    ADD_GEOFENCE_TO_PENDING_DELETION as ADD_GEOFENCE_TO_PENDING_DELETION,
    ADD_GEOFENCE,
    GeofencesState,
    UPDATE_GEOFENCE_BY_CORRELATION_ID,
    UPDATE_GEOFENCE_BY_ID,
    REMOVE_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID,
    UNDO_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_GEOFENCE_BY_EXTERNAL_ID,
    UNDO_PENDING_UPDATE_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_PENDING_UPDATE_GEOFENCE_BY_ID,
    ADD_GEOFENCE_TO_PENDING_UPDATE,
} from '../actions/GeofenceActions';
import Geofence from '../../models/app/geofences/Geofence';
import { StatusEnum } from '../../models/StatusEnum';

export function geofenceReducer(
    state: GeofencesState = { isLoaded: false, geofences: [], pendingDeletion: [], pendingUpdate: [] },
    action: GeofenceAction & GeofenceArrayAction
) {
    switch (action.type) {
        case ADD_GEOFENCE: {
            return Object.assign({}, state, { geofences: state.geofences.concat(action.geofence) });
        }
        case UPDATE_GEOFENCE_BY_CORRELATION_ID: {
            var geofenceIndex = state.geofences.findIndex(g => g.correlationModel?.correlationId === action.geofence.correlationModel.correlationId);
            var updatedGeofence = state.geofences[geofenceIndex];
            updatedGeofence.correlationModel.status = action.geofence.correlationModel.status;
            updatedGeofence.id = action.geofence.correlationModel.resourceId;
            let newArray = state.geofences.slice();
            newArray.splice(geofenceIndex, 1, updatedGeofence);
            return Object.assign({}, state, { geofences: newArray });
        }
        case UPDATE_GEOFENCE_BY_ID: {
            {
                const geofenceIndex = state.geofences.findIndex(g => g.id == action.geofence.id);
                let newArray = state.geofences.slice();
                newArray.splice(geofenceIndex, 1, action.geofence);
                return Object.assign({}, state, { geofences: newArray });
            }
        }
        case UNDO_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID: {
            const geofenceToRestore = state.pendingDeletion.find(
                (v: Geofence) => v.correlationModel.correlationId === action.geofence.correlationModel.correlationId
            );
            return Object.assign({}, state, {
                geofences: state.geofences.concat(geofenceToRestore),
                pendingDeletion: state.pendingDeletion.filter(
                    (v: Geofence) => v.correlationModel.correlationId !== action.geofence.correlationModel.correlationId
                ),
            });
        }
        case REMOVE_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.filter(
                    (v: Geofence) => v.correlationModel.correlationId !== action.geofence.correlationModel.correlationId
                ),
            });
        }
        case UNDO_PENDING_UPDATE_GEOFENCE_BY_CORRELATION_ID: {
            const idToRestore = state.geofences.find((v: Geofence) => v.correlationModel?.correlationId === action.geofence.correlationModel.correlationId).id;
            const geofenceToRestore = state.pendingUpdate.find((v: Geofence) => v.id == idToRestore);
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v: Geofence) => v.id !== idToRestore),
                geofences: state.geofences.filter((v: Geofence) => v.id !== idToRestore).concat(geofenceToRestore),
            });
        }
        case REMOVE_PENDING_UPDATE_GEOFENCE_BY_ID: {
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v: Geofence) => v.id !== action.geofence.id),
            });
        }
        case ADD_GEOFENCE_TO_PENDING_DELETION: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.concat(action.geofence),
            });
        }
        case ADD_GEOFENCE_TO_PENDING_UPDATE: {
            return Object.assign({}, state, { pendingUpdate: state.pendingDeletion.concat(action.geofence) });
        }
        case REMOVE_GEOFENCE_BY_EXTERNAL_ID: {
            return Object.assign({}, state, {
                geofences: state.geofences.filter((v: Geofence) => v.externalId !== action.geofence.externalId),
            });
        }
        case REMOVE_GEOFENCE_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                geofences: state.geofences.filter((v: Geofence) => v.correlationModel?.correlationId !== action.geofence.correlationModel.correlationId),
            });
        }
        case POPULATE_GEOFENCES: {
            return Object.assign({}, state, action.geofencesState);
        }
        default:
            return state;
    }
}
