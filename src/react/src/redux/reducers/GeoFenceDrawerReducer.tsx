import { CLOSE_GEOFENCE_DRAWER, OPEN_GEOFENCE_DRAWER, GeoFenceDrawerAction, GeoFenceDrawerState } from "../actions/GeoFenceDrawerActions";

export function geoFenceDrawerReducer(state: GeoFenceDrawerState = { isOpen: false } as GeoFenceDrawerState, action: GeoFenceDrawerAction) {
    switch (action.type) {
        case OPEN_GEOFENCE_DRAWER:
        case CLOSE_GEOFENCE_DRAWER:
            return action.geoFenceDrawer;
        default:
            return state;
    }
}
