import { CLOSE_GEOFENCE_DRAWER, OPEN_GEOFENCE_DRAWER, GeofenceDrawerAction, GeofenceDrawerState } from '../actions/GeofenceDrawerActions';

export function geofenceDrawerReducer(state: GeofenceDrawerState = { isOpen: false } as GeofenceDrawerState, action: GeofenceDrawerAction) {
    switch (action.type) {
        case OPEN_GEOFENCE_DRAWER:
        case CLOSE_GEOFENCE_DRAWER:
            return Object.assign({}, action.geofenceDrawer);
        default:
            return state;
    }
}
