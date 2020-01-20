import CircleGeofence from '../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../models/app/geofences/PolygonGeofence';

export const ADD_GEOFENCE = 'ADD_GEOFENCE';
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
    geofences: Array<CircleGeofence | PolygonGeofence>;
    isLoaded: boolean;
}

export function addGeofence(geofence: CircleGeofence | PolygonGeofence): GeofenceAction {
    return {
        type: ADD_GEOFENCE,
        geofence,
    };
}

export function removeGeofence(externalId: string): GeofenceAction {
    return {
        type: REMOVE_GEOFENCE,
        geofence: { externalId: externalId } as CircleGeofence | PolygonGeofence,
    };
}

export function populateGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): GeofenceArrayAction {
    return {
        type: POPULATE_GEOFENCES,
        geofencesState: {
            isLoaded: true,
            geofences,
        },
    };
}
