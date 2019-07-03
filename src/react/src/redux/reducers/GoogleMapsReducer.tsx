import {
    SELECT_SHAPE_PICKER,
    GoogleMapsAction,
    GoogleMapsState,
    ADD_CIRCULAR_GEOFENCE,
    ADD_POLYGON_GEOFENCE,
    CLEAR_GEOFENCE,
    ShapePicker,
} from "../actions/GoogleMapsActions";

export function googleMapsReducer(
    state: GoogleMapsState = { selectedShapePicker: ShapePicker.Circular, shapePickerEnabled: true } as GoogleMapsState,
    action: GoogleMapsAction
) {
    switch (action.type) {
        case SELECT_SHAPE_PICKER:
            return Object.assign({}, state, { selectedShapePicker: action.googleMaps.selectedShapePicker });
        case ADD_CIRCULAR_GEOFENCE:
            return Object.assign({}, state, { circularGeoFence: action.googleMaps.circularGeoFence });
        case ADD_POLYGON_GEOFENCE:
            return Object.assign({}, state, { polygonGeoFence: action.googleMaps.polygonGeoFence });
        case CLEAR_GEOFENCE:
            return Object.assign({}, state, { circularGeoFence: undefined, polygonGeoFence: undefined });
        default:
            return state;
    }
}
