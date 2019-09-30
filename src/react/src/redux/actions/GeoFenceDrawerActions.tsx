import PolygonGeoFence from "../../models/app/geofences/PolygonGeoFence";
import CircleGeoFence from "../../models/app/geofences/CircleGeoFence";

export const OPEN_GEOFENCE_DRAWER = "OPEN_GEOFENCE_DRAWER";
export const CLOSE_GEOFENCE_DRAWER = "CLOSE_GEOFENCE_DRAWER";

export interface GeoFenceDrawerAction {
    type: string;
    geoFenceDrawer: GeoFenceDrawerState;
}

export interface GeoFenceDrawerState {
    isOpen: boolean;
    editGeoFence: CircleGeoFence | PolygonGeoFence;
}

export function openGeoFenceDrawer(editGeoFence: CircleGeoFence | PolygonGeoFence): GeoFenceDrawerAction {
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
            editGeoFence: {} as CircleGeoFence | PolygonGeoFence,
        },
    };
}
