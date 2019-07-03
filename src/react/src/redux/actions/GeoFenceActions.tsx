import CircularGeoFence from "../../models/app/geofences/CircularGeoFence";
import PolygonGeoFence from "../../models/app/geofences/PolygonGeoFence";

export const ADD_GEOFENCE = "ADD_GEOFENCE";
export const REMOVE_GEOFENCE = "REMOVE_GEOFENCE";
export const POPULATE_GEOFENCES = "POPULATE_GEOFENCES";

export interface GeoFenceAction {
    type: string;
    geoFence: CircularGeoFence | PolygonGeoFence;
}
export interface GeoFenceArrayAction {
    type: string;
    geoFences: Array<CircularGeoFence | PolygonGeoFence>;
}

export function addGeoFence(geoFence: CircularGeoFence | PolygonGeoFence): GeoFenceAction {
    return {
        type: ADD_GEOFENCE,
        geoFence,
    };
}

export function removeGeoFence(name: string): GeoFenceAction {
    return {
        type: REMOVE_GEOFENCE,
        geoFence: { name: name } as CircularGeoFence | PolygonGeoFence,
    };
}

export function populateGeoFences(geoFences: Array<CircularGeoFence | PolygonGeoFence>): GeoFenceArrayAction {
    return {
        type: POPULATE_GEOFENCES,
        geoFences,
    };
}
