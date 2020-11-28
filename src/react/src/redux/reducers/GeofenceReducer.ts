import {
    POPULATE_MAP_GEOFENCES,
    GeofenceAction,
    GeofenceStateAction,
    ADD_GEOFENCE_TO_PENDING_DELETION,
    ADD_MAP_GEOFENCE,
    GeofencesState,
    REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID,
    REMOVE_MAP_GEOFENCE_BY_EXTERNAL_ID,
    REMOVE_PENDING_UPDATE_GEOFENCE_BY_RESOURCE_ID,
    ADD_GEOFENCE_TO_PENDING_UPDATE,
    RESET_MAP_GEOFENCES,
    RESET_TABLE_GEOFENCES,
    SET_SORT_ORDER,
    SET_ORDER_BY,
    SET_PAGE,
    SET_PAGE_COUNT,
    POPULATE_TABLE_GEOFENCES,
    SET_TABLE_IS_LOADED,
    SET_MAP_IS_LOADED,
    ADD_GEOFENCE_TO_PENDING_CREATION,
    REMOVE_PENDING_CREATE_GEOFENCE_BY_CORRELATION_ID,
    GeofenceUpdateAction,
    REMOVE_PENDING_DELETE_GEOFENCES_BY_CORRELATION_ID,
    SET_PENDING_BULK_OPERATION,
    GeofenceArrayAction,
    ADD_GEOFENCES_TO_PENDING_DELETION,
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
        pageCount: 50,
        totalCount: 0,
        pendingCreation: [],
        pendingDeletion: [],
        pendingUpdate: [],
        isPendingBulkOperation: false,
    },
    action: GeofenceAction & GeofenceStateAction & GeofenceUpdateAction & GeofenceArrayAction
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
        case REMOVE_PENDING_CREATE_GEOFENCE_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                pendingCreation: state.pendingCreation.filter(
                    (v: Geofence) => v.correlationModel.correlationId !== action.geofence.correlationModel.correlationId
                ),
            });
        }
        case REMOVE_PENDING_DELETE_GEOFENCES_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.filter(
                    (v: Geofence) => v.correlationModel.correlationId !== action.geofence.correlationModel.correlationId
                ),
            });
        }
        case REMOVE_PENDING_UPDATE_GEOFENCE_BY_RESOURCE_ID: {
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v) => v.updated.id !== action.geofence.id),
            });
        }
        case ADD_GEOFENCE_TO_PENDING_CREATION: {
            return Object.assign({}, state, {
                pendingCreation: state.pendingCreation.concat(action.geofence),
            });
        }
        case ADD_GEOFENCE_TO_PENDING_DELETION: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.concat(action.geofence),
            });
        }
        case ADD_GEOFENCES_TO_PENDING_DELETION: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.concat(action.geofences),
            });
        }
        case ADD_GEOFENCE_TO_PENDING_UPDATE: {
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
            return Object.assign({}, state, { mapGeofences: action.geofencesState.mapGeofences, isMapLoaded: action.geofencesState.isMapLoaded });
        }
        case POPULATE_TABLE_GEOFENCES: {
            return Object.assign({}, state, {
                tableGeofences: action.geofencesState.tableGeofences,
                isTableLoaded: action.geofencesState.isTableLoaded,
                totalCount: action.geofencesState.totalCount,
            });
        }
        case RESET_MAP_GEOFENCES: {
            return Object.assign({}, state, { mapGeofences: action.geofencesState.mapGeofences, isMapLoaded: action.geofencesState.isMapLoaded });
        }
        case RESET_TABLE_GEOFENCES: {
            return Object.assign({}, state, {
                tableGeofences: action.geofencesState.tableGeofences,
                isTableLoaded: action.geofencesState.isTableLoaded,
                totalCount: action.geofencesState.totalCount,
            });
        }
        case SET_TABLE_IS_LOADED: {
            return Object.assign({}, state, { isTableLoaded: action.geofencesState.isTableLoaded });
        }
        case SET_MAP_IS_LOADED: {
            return Object.assign({}, state, { isMapLoaded: action.geofencesState.isMapLoaded });
        }
        case SET_PENDING_BULK_OPERATION: {
            return Object.assign({}, state, { isPendingBulkOperation: action.geofencesState.isPendingBulkOperation });
        }
        default:
            return state;
    }
}
