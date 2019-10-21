import CoordinatePair from '../../models/app/geofences/CoordinatePair';

export enum ShapePicker {
    Circle = 'Circle',
    Polygon = 'Polygon',
}

export const SELECT_SHAPE_PICKER = 'SELECT_SHAPE_PICKER';
export const ENABLE_SHAPE_PICKER = 'ENABLE_SHAPE_PICKER';
export const DISABLE_SHAPE_PICKER = 'DISABLE_SHAPE_PICKER';
export const ADD_CIRCLE_GEOFENCE = 'ADD_CIRCLE_GEOFENCE';
export const ADD_POLYGON_GEOFENCE = 'ADD_POLYGON_GEOFENCE';
export const CLEAR_GEOFENCE = 'CLEAR_GEOFENCE';

export interface GoogleMapsAction {
    type: string;
    googleMaps: GoogleMapsState;
}

export interface GoogleMapsState {
    selectedShapePicker: ShapePicker;
    shapePickerEnabled: boolean;
    CircleGeofence: CircleGeofenceState;
    polygonGeofence: PolygonGeofenceState;
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
            CircleGeofence: CircleGeofence,
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

export function clearGeofence(): GoogleMapsAction {
    return {
        type: CLEAR_GEOFENCE,
        googleMaps: {} as GoogleMapsState,
    };
}
