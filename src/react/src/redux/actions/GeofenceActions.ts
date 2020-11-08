import CircleGeofence from '../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../models/app/geofences/PolygonGeofence';
import CorrelationModel from '../../models/CorrelationModel';
import { SortOrder, OrderByOptions } from '../../services/GeofenceService';
import CoordinatePair from '../../models/app/geofences/CoordinatePair';

export const SET_SORT_ORDER = 'SET_SORT_ORDER';
export const SET_ORDER_BY = 'SET_ORDER_BY';
export const SET_TABLE_IS_LOADED = 'SET_TABLE_IS_LOADED';
export const SET_MAP_IS_LOADED = 'SET_MAP_IS_LOADED';
export const SET_PAGE = 'SET_PAGE';
export const SET_PAGE_COUNT = 'SET_PAGE_COUNT';
export const ADD_MAP_GEOFENCE = 'ADD_MAP_GEOFENCE';
export const UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID = 'UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID';
export const UPDATE_MAP_GEOFENCE_BY_ID = 'UPDATE_MAP_GEOFENCE_BY_ID';
export const REMOVE_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID = 'REMOVE_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID';
export const UNDO_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID = 'UNDO_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID';
export const REMOVE_PENDING_UPDATE_MAP_GEOFENCE_BY_ID = 'REMOVE_PENDING_UPDATE_MAP_GEOFENCE_BY_ID';
export const UNDO_PENDING_UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID = 'UNDO_PENDING_UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID';
export const REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID = 'REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID';
export const ADD_MAP_GEOFENCE_TO_PENDING_DELETION = 'ADD_MAP_GEOFENCE_TO_PENDING_DELETION';
export const ADD_MAP_GEOFENCE_TO_PENDING_UPDATE = 'ADD_MAP_GEOFENCE_TO_PENDING_UDPATE';
export const POPULATE_MAP_GEOFENCES = 'POPULATE_MAP_GEOFENCES';
export const POPULATE_TABLE_GEOFENCES = 'POPULATE_TABLE_GEOFENCES';
export const REMOVE_MAP_GEOFENCE_BY_EXTERNAL_ID = 'REMOVE_MAP_GEOFENCE_BY_EXTERNAL_ID';
export const RESET_MAP_GEOFENCES = 'RESET_MAP_GEOFENCES';
export const RESET_TABLE_GEOFENCES = 'RESET_TABLE_GEOFENCES';

export interface GeofenceAction {
    type: string;
    geofence: CircleGeofence | PolygonGeofence;
}
export interface GeofenceArrayAction {
    type: string;
    geofencesState: GeofencesState;
}

export interface GeofencesState {
    pendingDeletion: Array<CircleGeofence | PolygonGeofence>;
    pendingUpdate: Array<CircleGeofence | PolygonGeofence>;
    mapGeofences: Array<CircleGeofence | PolygonGeofence>;
    tableGeofences: Array<CircleGeofence | PolygonGeofence>;
    sortOrder: SortOrder;
    orderBy: OrderByOptions;
    page: number;
    pageCount: number;
    isMapLoaded: boolean;
    isTableLoaded: boolean;
}

export function addMapGeofence(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_MAP_GEOFENCE,
        geofence,
    };
}

export function setSortOrder(sortOrder: SortOrder): GeofenceArrayAction {
    return {
        type: SET_SORT_ORDER,
        geofencesState: {
            sortOrder: sortOrder,
        } as GeofencesState,
    };
}

export function setIsTableLoaded(isLoaded: boolean) {
    return {
        type: SET_TABLE_IS_LOADED,
        geofencesState: {
            isTableLoaded: isLoaded,
        } as GeofencesState,
    };
}

export function setIsMapLoaded(isLoaded: boolean) {
    return {
        type: SET_TABLE_IS_LOADED,
        geofencesState: {
            isMapLoaded: isLoaded,
        } as GeofencesState,
    };
}

export function setOrderBy(orderBy: OrderByOptions): GeofenceArrayAction {
    return {
        type: SET_ORDER_BY,
        geofencesState: {
            orderBy: orderBy,
        } as GeofencesState,
    };
}

export function setPage(page: number): GeofenceArrayAction {
    return {
        type: SET_PAGE,
        geofencesState: {
            page: page,
        } as GeofencesState,
    };
}

export function setPageCount(pageCount: number): GeofenceArrayAction {
    return {
        type: SET_PAGE_COUNT,
        geofencesState: {
            pageCount: pageCount,
        } as GeofencesState,
    };
}

export function updateMapGeofenceStatusByCorrelationId(correlationModel: CorrelationModel) {
    return {
        type: UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: correlationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function updateMapGeofenceById(geofence: CircleGeofence | PolygonGeofence) {
    return {
        type: UPDATE_MAP_GEOFENCE_BY_ID,
        geofence,
    };
}

export function removePendingDeleteMapGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: REMOVE_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function undoPendingDeleteMapGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: UNDO_PENDING_DELETE_MAP_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function removePendingUpdateMapGeofenceById(id: string): GeofenceAction {
    return {
        type: REMOVE_PENDING_UPDATE_MAP_GEOFENCE_BY_ID,
        geofence: { id: id } as CircleGeofence | PolygonGeofence,
    };
}

export function undoPendingUpdateMapGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: UNDO_PENDING_UPDATE_MAP_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function addMapGeofenceToPendingDeletion(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_MAP_GEOFENCE_TO_PENDING_DELETION,
        geofence,
    };
}

export function addMapGeofenceToPendingUpdate(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_MAP_GEOFENCE_TO_PENDING_UPDATE,
        geofence,
    };
}

export function removeMapGeofenceByExternalId(externalId: string): GeofenceAction {
    return {
        type: REMOVE_MAP_GEOFENCE_BY_EXTERNAL_ID,
        geofence: { externalId: externalId } as CircleGeofence | PolygonGeofence,
    };
}

export function removeMapGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function populateMapGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): GeofenceArrayAction {
    return {
        type: POPULATE_MAP_GEOFENCES,
        geofencesState: {
            isMapLoaded: true,
            mapGeofences: geofences,
        } as GeofencesState,
    };
}

export function populateTableGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): GeofenceArrayAction {
    return {
        type: POPULATE_TABLE_GEOFENCES,
        geofencesState: {
            isTableLoaded: true,
            tableGeofences: geofences,
        } as GeofencesState,
    };
}

export function resetMapGeofences(): GeofenceArrayAction {
    return {
        type: RESET_MAP_GEOFENCES,
        geofencesState: {
            isMapLoaded: false,
            mapGeofences: [],
        } as GeofencesState,
    };
}

export function resetTableGeofences(): GeofenceArrayAction {
    return {
        type: RESET_TABLE_GEOFENCES,
        geofencesState: {
            isTableLoaded: false,
            tableGeofences: [],
        } as GeofencesState,
    };
}
