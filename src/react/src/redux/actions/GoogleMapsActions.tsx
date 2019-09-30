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
    CircleGeoFence: CircleGeoFenceState;
    polygonGeoFence: PolygonGeoFenceState;
}

export interface CircleGeoFenceState {
    center: CoordinatePair;
    radius: number;
}

export interface PolygonGeoFenceState {
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

export function addCircleGeoFence(CircleGeoFence: CircleGeoFenceState): GoogleMapsAction {
    return {
        type: ADD_CIRCLE_GEOFENCE,
        googleMaps: {
            CircleGeoFence: CircleGeoFence,
        } as GoogleMapsState,
    };
}

export function addPolygonGeoFence(polygonGeoFence: PolygonGeoFenceState): GoogleMapsAction {
    return {
        type: ADD_POLYGON_GEOFENCE,
        googleMaps: {
            polygonGeoFence: polygonGeoFence,
        } as GoogleMapsState,
    };
}

export function clearGeoFence(): GoogleMapsAction {
    return {
        type: CLEAR_GEOFENCE,
        googleMaps: {} as GoogleMapsState,
    };
}
