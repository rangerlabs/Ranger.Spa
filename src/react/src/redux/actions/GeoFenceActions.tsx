import CircleGeoFence from '../../models/app/geofences/CircleGeoFence';
import PolygonGeoFence from '../../models/app/geofences/PolygonGeoFence';

export const ADD_GEOFENCE = 'ADD_GEOFENCE';
export const REMOVE_GEOFENCE = 'REMOVE_GEOFENCE';
export const POPULATE_GEOFENCES = 'POPULATE_GEOFENCES';

export interface GeoFenceAction {
    type: string;
    geoFence: CircleGeoFence | PolygonGeoFence;
}
export interface GeoFenceArrayAction {
    type: string;
    geoFences: Array<CircleGeoFence | PolygonGeoFence>;
}

export function addGeoFence(geoFence: CircleGeoFence | PolygonGeoFence): GeoFenceAction {
    return {
        type: ADD_GEOFENCE,
        geoFence,
    };
}

export function removeGeoFence(name: string): GeoFenceAction {
    return {
        type: REMOVE_GEOFENCE,
        geoFence: { name: name } as CircleGeoFence | PolygonGeoFence,
    };
}

export function populateGeoFences(geoFences: Array<CircleGeoFence | PolygonGeoFence>): GeoFenceArrayAction {
    return {
        type: POPULATE_GEOFENCES,
        geoFences,
    };
}
