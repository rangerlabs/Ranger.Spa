import {
    POPULATE_MAP_GEOFENCES,
    GeofenceAction,
    GeofenceArrayAction,
    ADD_MAP_GEOFENCE_TO_PENDING_DELETION,
    ADD_MAP_GEOFENCE,
    GeofencesState,
    REMOVE_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_MAP_GEOFENCE_BY_EXTERNAL_ID,
    REMOVE_PENDING_UPDATE_MAP_GEOFENCE_BY_RESOURCE_ID,
    ADD_MAP_GEOFENCE_TO_PENDING_UPDATE,
    RESET_MAP_GEOFENCES,
    RESET_TABLE_GEOFENCES,
    SET_SORT_ORDER,
    SET_ORDER_BY,
    SET_PAGE,
    SET_PAGE_COUNT,
    POPULATE_TABLE_GEOFENCES,
    SET_TABLE_IS_LOADED,
    SET_MAP_IS_LOADED,
    ADD_MAP_GEOFENCE_TO_PENDING_CREATION,
    REMOVE_PENDING_CREATE_MAP_GEOFENCE_BY_CORRELATION_ID,
    GeofenceUpdateAction,
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
        pendingCreation: [],
        pendingDeletion: [],
        pendingUpdate: [],
    },
    action: GeofenceAction & GeofenceArrayAction & GeofenceUpdateAction
) {
    switch (action.type) {
        case ADD_MAP_GEOFENCE: {
            return Object.assign({}, state, { mapGeofences: state.mapGeofences.concat(action.geofence) });
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
        case REMOVE_PENDING_CREATE_MAP_GEOFENCE_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                pendingCreation: state.pendingCreation.filter(
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
        case REMOVE_PENDING_UPDATE_MAP_GEOFENCE_BY_RESOURCE_ID: {
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v) => v.updated.id !== action.geofence.id),
            });
        }
        case ADD_MAP_GEOFENCE_TO_PENDING_CREATION: {
            return Object.assign({}, state, {
                pendingCreation: state.pendingCreation.concat(action.geofence),
            });
        }
        case ADD_MAP_GEOFENCE_TO_PENDING_DELETION: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.concat(action.geofence),
            });
        }
        case ADD_MAP_GEOFENCE_TO_PENDING_UPDATE: {
            return Object.assign({}, state, { pendingUpdate: state.pendingUpdate.concat((action as GeofenceUpdateAction).update) });
        }
        case REMOVE_MAP_GEOFENCE_BY_EXTERNAL_ID: {
            return Object.assign({}, state, {
                mapGeofences: state.mapGeofences.filter((v: Geofence) => v.externalId !== action.geofence.externalId),
                tableGeofences: state.tableGeofences.filter((v: Geofence) => v.externalId !== action.geofence.externalId),
            });
        }
        case REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                mapGeofences: state.mapGeofences.filter((v: Geofence) => v.correlationModel?.correlationId !== action.geofence.correlationModel.correlationId),
                tableGeofences: state.tableGeofences.filter(
                    (v: Geofence) => v.correlationModel?.correlationId !== action.geofence.correlationModel.correlationId
                ),
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
        case SET_TABLE_IS_LOADED: {
            return Object.assign({}, state, action.geofencesState);
        }
        case SET_MAP_IS_LOADED: {
            return Object.assign({}, state, action.geofencesState);
        }
        default:
            return state;
    }
}
