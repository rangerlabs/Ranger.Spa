import CoordinatePair from '../../models/app/geofences/CoordinatePair';
import TestRun from '../../models/app/geofences/TestRun';

export enum ShapePicker {
    Circle = 0,
    Polygon = 1,
    TestRun = 2,
}

export const IS_INFO_WINDOW_VISIBILE = 'IS_INFO_WINDOW_VISIBILE';
export const IS_CREATING_GEOFENCE = 'IS_CREATING_GEOFENCE';
export const SELECT_SHAPE_PICKER = 'SELECT_SHAPE_PICKER';
export const ADD_CIRCLE_GEOFENCE = 'ADD_CIRCLE_GEOFENCE';
export const ADD_POLYGON_GEOFENCE = 'ADD_POLYGON_GEOFENCE';
export const CLEAR_GEOFENCE = 'CLEAR_GEOFENCE';

export interface GoogleMapsAction {
    type: string;
    googleMaps: GoogleMapsState;
}

export interface GoogleMapsState {
    isInfoWindowVisible: boolean;
    isCreatingGeofence: boolean;
    selectedShapePicker: ShapePicker;
    circleGeofence: CircleGeofenceState;
    polygonGeofence: PolygonGeofenceState;
    testRun: TestRun;
}

export interface CircleGeofenceState {
    center: CoordinatePair;
    radius: number;
}

export interface PolygonGeofenceState {
    coordinatePairArray: CoordinatePair[];
}

export function selectShapePicker(shape: ShapePicker): GoogleMapsAction {
    return {
        type: SELECT_SHAPE_PICKER,
        googleMaps: {
            selectedShapePicker: shape,
        } as GoogleMapsState,
    };
}

export function addCircleGeofence(CircleGeofence: CircleGeofenceState): GoogleMapsAction {
    return {
        type: ADD_CIRCLE_GEOFENCE,
        googleMaps: {
            circleGeofence: CircleGeofence,
        } as GoogleMapsState,
    };
}

export function addPolygonGeofence(polygonGeofence: PolygonGeofenceState): GoogleMapsAction {
    return {
        type: ADD_POLYGON_GEOFENCE,
        googleMaps: {
            polygonGeofence: polygonGeofence,
        } as GoogleMapsState,
    };
}

export function setInfoWindowVisible(isVisible: boolean): GoogleMapsAction {
    return {
        type: IS_INFO_WINDOW_VISIBILE,
        googleMaps: {
            isInfoWindowVisible: isVisible,
        } as GoogleMapsState,
    };
}
export function setCreatingGeofence(isCreating: boolean): GoogleMapsAction {
    return {
        type: IS_CREATING_GEOFENCE,
        googleMaps: {
            isCreatingGeofence: isCreating,
        } as GoogleMapsState,
    };
}
export function clearGeofence(): GoogleMapsAction {
    return {
        type: CLEAR_GEOFENCE,
        googleMaps: {} as GoogleMapsState,
    };
}
