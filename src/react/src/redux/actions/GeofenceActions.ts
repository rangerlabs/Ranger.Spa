import CircleGeofence from '../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../models/app/geofences/PolygonGeofence';
import CorrelationModel from '../../models/CorrelationModel';
import { SortOrder, OrderByOptions } from '../../services/GeofenceService';

export const SET_SORT_ORDER = 'SET_SORT_ORDER';
export const SET_ORDER_BY = 'SET_ORDER_BY';
export const SET_TABLE_IS_LOADED = 'SET_TABLE_IS_LOADED';
export const SET_MAP_IS_LOADED = 'SET_MAP_IS_LOADED';
export const SET_PAGE = 'SET_PAGE';
export const SET_PAGE_COUNT = 'SET_PAGE_COUNT';
export const ADD_MAP_GEOFENCE = 'ADD_MAP_GEOFENCE';
export const REMOVE_PENDING_CREATE_GEOFENCE_BY_CORRELATION_ID = 'REMOVE_PENDING_CREATE_GEOFENCE_BY_CORRELATION_ID';
export const REMOVE_PENDING_DELETE_GEOFENCES_BY_CORRELATION_ID = 'REMOVE_PENDING_DELETE_GEOFENCES_BY_CORRELATION_ID';
export const REMOVE_PENDING_UPDATE_GEOFENCE_BY_RESOURCE_ID = 'REMOVE_PENDING_UPDATE_GEOFENCE_BY_RESOURCE_ID';
export const REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID = 'REMOVE_MAP_GEOFENCE_BY_CORRELATION_ID';
export const ADD_MAP_GEOFENCE_TO_PENDING_CREATION = 'ADD_MAP_GEOFENCE_TO_PENDING_CREATION';
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
export interface GeofenceStateAction {
    type: string;
    geofencesState: GeofencesState;
}
export interface GeofenceUpdateAction {
    type: string;
    update: { old: CircleGeofence | PolygonGeofence; updated: CircleGeofence | PolygonGeofence };
}

export interface GeofencesState {
    pendingCreation: Array<CircleGeofence | PolygonGeofence>;
    pendingDeletion: Array<CircleGeofence | PolygonGeofence>;
    pendingUpdate: Array<{ old: CircleGeofence | PolygonGeofence; updated: CircleGeofence | PolygonGeofence }>;
    mapGeofences: Array<CircleGeofence | PolygonGeofence>;
    tableGeofences: Array<CircleGeofence | PolygonGeofence>;
    sortOrder: SortOrder;
    orderBy: OrderByOptions;
    page: number;
    pageCount: number;
    totalCount: number;
    isMapLoaded: boolean;
    isTableLoaded: boolean;
}

export function addMapGeofence(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_MAP_GEOFENCE,
        geofence,
    };
}

export function setSortOrder(sortOrder: SortOrder): GeofenceStateAction {
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

export function setOrderBy(orderBy: OrderByOptions): GeofenceStateAction {
    return {
        type: SET_ORDER_BY,
        geofencesState: {
            orderBy: orderBy,
        } as GeofencesState,
    };
}

export function setPage(page: number): GeofenceStateAction {
    return {
        type: SET_PAGE,
        geofencesState: {
            page: page,
        } as GeofencesState,
    };
}

export function setPageCount(pageCount: number): GeofenceStateAction {
    return {
        type: SET_PAGE_COUNT,
        geofencesState: {
            pageCount: pageCount,
        } as GeofencesState,
    };
}

export function removePendingCreateGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: REMOVE_PENDING_CREATE_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function removePendingDeleteGeofencesByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: REMOVE_PENDING_DELETE_GEOFENCES_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function removePendingUpdateGeofenceByResourceId(id: string): GeofenceAction {
    return {
        type: REMOVE_PENDING_UPDATE_GEOFENCE_BY_RESOURCE_ID,
        geofence: { id: id } as CircleGeofence | PolygonGeofence,
    };
}

export function addMapGeofenceToPendingCreation(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_MAP_GEOFENCE_TO_PENDING_CREATION,
        geofence,
    };
}

export function addMapGeofenceToPendingDeletion(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_MAP_GEOFENCE_TO_PENDING_DELETION,
        geofence,
    };
}

export function addMapGeofenceToPendingUpdate(old: CircleGeofence | PolygonGeofence, updated: CircleGeofence | PolygonGeofence): GeofenceUpdateAction {
    return {
        type: ADD_MAP_GEOFENCE_TO_PENDING_UPDATE,
        update: { old, updated },
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

export function populateMapGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): GeofenceStateAction {
    return {
        type: POPULATE_MAP_GEOFENCES,
        geofencesState: {
            isMapLoaded: true,
            mapGeofences: geofences,
        } as GeofencesState,
    };
}

export function populateTableGeofences(geofences: Array<CircleGeofence | PolygonGeofence>, totalCount: number): GeofenceStateAction {
    return {
        type: POPULATE_TABLE_GEOFENCES,
        geofencesState: {
            isTableLoaded: true,
            tableGeofences: geofences,
            totalCount: totalCount,
        } as GeofencesState,
    };
}

export function resetMapGeofences(): GeofenceStateAction {
    return {
        type: RESET_MAP_GEOFENCES,
        geofencesState: {
            isMapLoaded: false,
            mapGeofences: [],
        } as GeofencesState,
    };
}

export function resetTableGeofences(): GeofenceStateAction {
    return {
        type: RESET_TABLE_GEOFENCES,
        geofencesState: {
            isTableLoaded: false,
            tableGeofences: [],
            totalCount: 0,
        } as GeofencesState,
    };
}
