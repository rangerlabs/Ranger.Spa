import {
    SELECT_SHAPE_PICKER,
    GoogleMapsAction,
    GoogleMapsState,
    ADD_CIRCLE_GEOFENCE,
    ADD_POLYGON_GEOFENCE,
    CLEAR_GEOFENCE,
    ShapePicker,
} from '../actions/GoogleMapsActions';

export function googleMapsReducer(
    state: GoogleMapsState = { selectedShapePicker: ShapePicker.Circle, shapePickerEnabled: true } as GoogleMapsState,
    action: GoogleMapsAction
) {
    switch (action.type) {
        case SELECT_SHAPE_PICKER:
            return Object.assign({}, state, { selectedShapePicker: action.googleMaps.selectedShapePicker });
        case ADD_CIRCLE_GEOFENCE:
            return Object.assign({}, state, { CircleGeofence: action.googleMaps.CircleGeofence });
        case ADD_POLYGON_GEOFENCE:
            return Object.assign({}, state, { polygonGeofence: action.googleMaps.polygonGeofence });
        case CLEAR_GEOFENCE:
            return Object.assign({}, state, { CircleGeofence: undefined, polygonGeofence: undefined });
        default:
            return state;
    }
}
