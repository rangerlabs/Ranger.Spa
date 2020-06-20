import {
    SELECT_SHAPE_PICKER,
    ADD_CIRCLE_GEOFENCE,
    ADD_POLYGON_GEOFENCE,
    CLEAR_GEOFENCE,
    IS_INFO_WINDOW_VISIBILE,
    ShapePicker,
    GoogleMapsAction,
    GoogleMapsState,
    IS_CREATING_GEOFENCE,
    ADD_TEST_RUN,
} from '../actions/GoogleMapsActions';

export function googleMapsReducer(
    state: GoogleMapsState = { selectedShapePicker: ShapePicker.CIRCLE, isInfoWindowVisible: false, isCreatingGeofence: false } as GoogleMapsState,
    action: GoogleMapsAction
) {
    switch (action.type) {
        case SELECT_SHAPE_PICKER:
            return Object.assign({}, state, { selectedShapePicker: action.googleMaps.selectedShapePicker });
        case ADD_CIRCLE_GEOFENCE:
            return Object.assign({}, state, { circleGeofence: action.googleMaps.circleGeofence });
        case ADD_POLYGON_GEOFENCE:
            return Object.assign({}, state, { polygonGeofence: action.googleMaps.polygonGeofence });
        case ADD_TEST_RUN:
            return Object.assign({}, state, { testRun: action.googleMaps.testRun });
        case CLEAR_GEOFENCE:
            return Object.assign({}, state, { circleGeofence: undefined, polygonGeofence: undefined });
        case IS_INFO_WINDOW_VISIBILE:
            return Object.assign({}, state, { isInfoWindowVisible: action.googleMaps.isInfoWindowVisible });
        case IS_CREATING_GEOFENCE:
            return Object.assign({}, state, { isCreatingGeofence: action.googleMaps.isCreatingGeofence });
        default:
            return state;
    }
}
