import PolygonGeoFence from "../../models/app/geofences/PolygonGeoFence";
import CircularGeoFence from "../../models/app/geofences/CircularGeoFence";

export const OPEN_GEOFENCE_DRAWER = "OPEN_GEOFENCE_DRAWER";
export const CLOSE_GEOFENCE_DRAWER = "CLOSE_GEOFENCE_DRAWER";

export interface GeoFenceDrawerAction {
    type: string;
    geoFenceDrawer: GeoFenceDrawerState;
}

export interface GeoFenceDrawerState {
    isOpen: boolean;
    editGeoFence: CircularGeoFence | PolygonGeoFence;
}

export function openGeoFenceDrawer(editGeoFence: CircularGeoFence | PolygonGeoFence): GeoFenceDrawerAction {
    return {
        type: OPEN_GEOFENCE_DRAWER,
        geoFenceDrawer: {
            isOpen: true,
            editGeoFence,
        },
    };
}

export function closeGeoFenceDrawer(): GeoFenceDrawerAction {
    return {
        type: CLOSE_GEOFENCE_DRAWER,
        geoFenceDrawer: {
            isOpen: false,
            editGeoFence: {} as CircularGeoFence | PolygonGeoFence,
        },
    };
}
