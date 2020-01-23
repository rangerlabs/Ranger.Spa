import CircleGeofence from '../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../models/app/geofences/PolygonGeofence';
import CorrelationModel from '../../models/CorrelationModel';

export const ADD_GEOFENCE = 'ADD_GEOFENCE';
export const UPDATE_GEOFENCE_BY_CORRELATION_ID = 'UPDATE_GEOFENCE_BY_CORRELATION_ID';
export const UPDATE_GEOFENCE_BY_ID = 'UPDATE_GEOFENCE_BY_ID';
export const REMOVE_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID = 'REMOVE_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID';
export const REMOVE_GEOFENCE_BY_CORRELATION_ID = 'REMOVE_GEOFENCE_BY_CORRELATION_ID';
export const UNDO_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID = 'UNDO_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID';
export const REMOVE_GEOFENCE = 'REMOVE_GEOFENCE';
export const POPULATE_GEOFENCES = 'POPULATE_GEOFENCES';

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
    geofences: Array<CircleGeofence | PolygonGeofence>;
    isLoaded: boolean;
}

export function addGeofence(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_GEOFENCE,
        geofence,
    };
}

export function updateGeofenceStatusByCorrelationId(correlationModel: CorrelationModel) {
    return {
        type: UPDATE_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: correlationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function updateGeofenceById(geofence: CircleGeofence | PolygonGeofence) {
    return {
        type: UPDATE_GEOFENCE_BY_ID,
        geofence,
    };
}

export function removePendingDeleteGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: REMOVE_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function undoPendingDeleteGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: REMOVE_GEOFENCE,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function removeGeofence(externalId: string, correlationId: string): GeofenceAction {
    return {
        type: REMOVE_GEOFENCE,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel, externalId: externalId } as CircleGeofence | PolygonGeofence,
    };
}

export function removeGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: REMOVE_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function populateGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): GeofenceArrayAction {
    return {
        type: POPULATE_GEOFENCES,
        geofencesState: {
            isLoaded: true,
            geofences,
            pendingDeletion: [],
        },
    };
}
