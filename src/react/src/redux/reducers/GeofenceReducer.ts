import {
    POPULATE_MAP_GEOFENCES,
    GeofenceAction,
    GeofenceArrayAction,
    ADD_MAP_GEOFENCE_TO_PENDING_DELETION,
    ADD_MAP_GEOFENCE,
    GeofencesState,
    UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID,
    UPDATE_MAP_GEOFENCE_BY_ID,
    REMOVE_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID,
    UNDO_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_MAP_GEOFENCE_BY_EXTERNAL_ID,
    UNDO_PENDING_UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_PENDING_UPDATE_MAP_GEOFENCE_BY_ID,
    ADD_MAP_GEOFENCE_TO_PENDING_UPDATE,
    RESET_MAP_GEOFENCES,
    RESET_TABLE_GEOFENCES,
    SET_SORT_ORDER,
    SET_ORDER_BY,
    SET_PAGE,
    SET_PAGE_COUNT,
    POPULATE_TABLE_GEOFENCES,
} from '../actions/GeofenceActions';
import Geofence from '../../models/app/geofences/Geofence';

export function geofenceReducer(
    state: GeofencesState = {
        isMapLoaded: false,
        isTableLoaded: false,
        mapGeofences: [],
        tableGeofences: [],
        sortOrder: 'desc',
        orderBy: 'CreatedDate',
        page: 0,
        pageCount: 100,
        pendingDeletion: [],
        pendingUpdate: [],
    },
    action: GeofenceAction & GeofenceArrayAction
) {
    switch (action.type) {
        case ADD_MAP_GEOFENCE: {
            return Object.assign({}, state, { geofences: state.mapGeofences.concat(action.geofence) });
        }
        case UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID: {
            var geofenceIndex = state.mapGeofences.findIndex((g) => g.correlationModel?.correlationId === action.geofence.correlationModel.correlationId);
            var updatedGeofence = state.mapGeofences[geofenceIndex];
            updatedGeofence.correlationModel.status = action.geofence.correlationModel.status;
            updatedGeofence.id = action.geofence.correlationModel.resourceId;
            let newArray = state.mapGeofences.slice();
            newArray.splice(geofenceIndex, 1, updatedGeofence);
            return Object.assign({}, state, { geofences: newArray });
        }
        case UPDATE_MAP_GEOFENCE_BY_ID: {
            {
                const geofenceIndex = state.mapGeofences.findIndex((g) => g.id == action.geofence.id);
                let newArray = state.mapGeofences.slice();
                newArray.splice(geofenceIndex, 1, action.geofence);
                return Object.assign({}, state, { geofences: newArray });
            }
        }
        case SET_SORT_ORDER: {
            return Object.assign({}, state, { sortOrder: action.geofencesState.sortOrder });
        }
        case SET_ORDER_BY: {
            return Object.assign({}, state, { orderBy: action.geofencesState.orderBy });
        }
        case SET_PAGE: {
            return Object.assign({}, state, { page: action.geofencesState.page });
        }
        case SET_PAGE_COUNT: {
            return Object.assign({}, state, { pageCount: action.geofencesState.pageCount });
        }
        case UNDO_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID: {
            const geofenceToRestore = state.pendingDeletion.find(
                (v: Geofence) => v.correlationModel.correlationId === action.geofence.correlationModel.correlationId
            );
            return Object.assign({}, state, {
                geofences: state.mapGeofences.concat(geofenceToRestore),
                pendingDeletion: state.pendingDeletion.filter(
                    (v: Geofence) => v.correlationModel.correlationId !== action.geofence.correlationModel.correlationId
                ),
            });
        }
        case REMOVE_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.filter(
                    (v: Geofence) => v.correlationModel.correlationId !== action.geofence.correlationModel.correlationId
                ),
            });
        }
        case UNDO_PENDING_UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID: {
            const idToRestore = state.mapGeofences.find((v: Geofence) => v.correlationModel?.correlationId === action.geofence.correlationModel.correlationId)
                .id;
            const geofenceToRestore = state.pendingUpdate.find((v: Geofence) => v.id == idToRestore);
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v: Geofence) => v.id !== idToRestore),
                geofences: state.mapGeofences.filter((v: Geofence) => v.id !== idToRestore).concat(geofenceToRestore),
            });
        }
        case REMOVE_PENDING_UPDATE_MAP_GEOFENCE_BY_ID: {
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v: Geofence) => v.id !== action.geofence.id),
            });
        }
        case ADD_MAP_GEOFENCE_TO_PENDING_DELETION: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.concat(action.geofence),
            });
        }
        case ADD_MAP_GEOFENCE_TO_PENDING_UPDATE: {
            return Object.assign({}, state, { pendingUpdate: state.pendingDeletion.concat(action.geofence) });
        }
        case REMOVE_MAP_GEOFENCE_BY_EXTERNAL_ID: {
            return Object.assign({}, state, {
                geofences: state.mapGeofences.filter((v: Geofence) => v.externalId !== action.geofence.externalId),
            });
        }
        case REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                geofences: state.mapGeofences.filter((v: Geofence) => v.correlationModel?.correlationId !== action.geofence.correlationModel.correlationId),
            });
        }
        case POPULATE_MAP_GEOFENCES: {
            return Object.assign({}, state, action.geofencesState);
        }
        case POPULATE_TABLE_GEOFENCES: {
            return Object.assign({}, state, action.geofencesState);
        }
        case RESET_MAP_GEOFENCES: {
            return Object.assign({}, state, action.geofencesState);
        }
        case RESET_TABLE_GEOFENCES: {
            return Object.assign({}, state, action.geofencesState);
        }
        default:
            return state;
    }
}
