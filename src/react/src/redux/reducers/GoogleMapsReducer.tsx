import {
    SELECT_SHAPE_PICKER,
    ADD_CIRCLE_GEOFENCE,
    ADD_POLYGON_GEOFENCE,
    CLEAR_GEOFENCE,
    IS_INFO_WINDOW_VISIBILE,
    ShapePicker,
    GoogleMapsAction,
    GoogleMapsState,
} from '../actions/GoogleMapsActions';

export function googleMapsReducer(
    state: GoogleMapsState = { selectedShapePicker: ShapePicker.Circle, isInfoWindowVisible: false } as GoogleMapsState,
    action: GoogleMapsAction
) {
    switch (action.type) {
        case SELECT_SHAPE_PICKER:
            return Object.assign({}, state, { selectedShapePicker: action.googleMaps.selectedShapePicker });
        case ADD_CIRCLE_GEOFENCE:
            return Object.assign({}, state, { circleGeofence: action.googleMaps.circleGeofence });
        case ADD_POLYGON_GEOFENCE:
            return Object.assign({}, state, { polygonGeofence: action.googleMaps.polygonGeofence });
        case CLEAR_GEOFENCE:
            return Object.assign({}, state, { circleGeofence: undefined, polygonGeofence: undefined });
        case IS_INFO_WINDOW_VISIBILE:
            return Object.assign({}, state, { isInfoWindowVisible: action.googleMaps.isInfoWindowVisible });
        default:
            return state;
    }
}
