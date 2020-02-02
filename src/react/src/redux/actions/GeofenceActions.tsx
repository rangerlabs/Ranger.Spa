import CircleGeofence from '../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../models/app/geofences/PolygonGeofence';
import CorrelationModel from '../../models/CorrelationModel';

export const ADD_GEOFENCE = 'ADD_GEOFENCE';
export const UPDATE_GEOFENCE_BY_CORRELATION_ID = 'UPDATE_GEOFENCE_BY_CORRELATION_ID';
export const UPDATE_GEOFENCE_BY_ID = 'UPDATE_GEOFENCE_BY_ID';
export const REMOVE_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID = 'REMOVE_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID';
export const UNDO_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID = 'UNDO_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID';
export const REMOVE_PENDING_UPDATE_GEOFENCE_BY_ID = 'REMOVE_PENDING_UPDATE_GEOFENCE_BY_ID';
export const UNDO_PENDING_UPDATE_GEOFENCE_BY_CORRELATION_ID = 'UNDO_PENDING_UPDATE_GEOFENCE_BY_CORRELATION_ID';
export const REMOVE_GEOFENCE_BY_CORRELATION_ID = 'REMOVE_GEOFENCE_BY_CORRELATION_ID';
export const ADD_GEOFENCE_TO_PENDING_DELETION = 'MOVE_GEOFENCE_TO_PENDING_DELETION';
export const ADD_GEOFENCE_TO_PENDING_UPDATE = 'ADD_GEOFENCE_TO_PENDING_UDPATE';
export const POPULATE_GEOFENCES = 'POPULATE_GEOFENCES';
export const REMOVE_GEOFENCE_BY_EXTERNAL_ID = 'REMOVE_GEOFENCE_BY_EXTERNAL_ID';
export const RESET_GEOFENCES = 'RESET_GEOFENCES';

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
        type: UNDO_PENDING_DELETE_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function removePendingUpdateGeofenceById(id: string): GeofenceAction {
    return {
        type: REMOVE_PENDING_UPDATE_GEOFENCE_BY_ID,
        geofence: { id: id } as CircleGeofence | PolygonGeofence,
    };
}

export function undoPendingUpdateGeofenceByCorrelationId(correlationId: string): GeofenceAction {
    return {
        type: UNDO_PENDING_UPDATE_GEOFENCE_BY_CORRELATION_ID,
        geofence: { correlationModel: { correlationId: correlationId } as CorrelationModel } as CircleGeofence | PolygonGeofence,
    };
}

export function addGeofenceToPendingDeletion(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_GEOFENCE_TO_PENDING_DELETION,
        geofence,
    };
}

export function addGeofenceToPendingUpdate(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_GEOFENCE_TO_PENDING_UPDATE,
        geofence,
    };
}

export function removeGeofenceByExternalId(externalId: string): GeofenceAction {
    return {
        type: REMOVE_GEOFENCE_BY_EXTERNAL_ID,
        geofence: { externalId: externalId } as CircleGeofence | PolygonGeofence,
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
            pendingUpdate: [],
        },
    };
}

export function resetGeofences(): GeofenceArrayAction {
    return {
        type: RESET_GEOFENCES,
        geofencesState: {
            isLoaded: false,
            geofences: [],
            pendingDeletion: [],
            pendingUpdate: [],
        },
    };
}
