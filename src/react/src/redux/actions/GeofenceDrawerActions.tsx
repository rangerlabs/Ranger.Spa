import PolygonGeofence from "../../models/app/geofences/PolygonGeofence";
import CircleGeofence from "../../models/app/geofences/CircleGeofence";

export const OPEN_GEOFENCE_DRAWER = "OPEN_GEOFENCE_DRAWER";
export const CLOSE_GEOFENCE_DRAWER = "CLOSE_GEOFENCE_DRAWER";

export interface GeofenceDrawerAction {
    type: string;
    geofenceDrawer: GeofenceDrawerState;
}

export interface GeofenceDrawerState {
    isOpen: boolean;
    editGeofence: CircleGeofence | PolygonGeofence;
}

export function openGeofenceDrawer(editGeofence: CircleGeofence | PolygonGeofence): GeofenceDrawerAction {
    return {
        type: OPEN_GEOFENCE_DRAWER,
        geofenceDrawer: {
            isOpen: true,
            editGeofence,
        },
    };
}

export function closeGeofenceDrawer(): GeofenceDrawerAction {
    return {
        type: CLOSE_GEOFENCE_DRAWER,
        geofenceDrawer: {
            isOpen: false,
            editGeofence: {} as CircleGeofence | PolygonGeofence,
        },
    };
}
