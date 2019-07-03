import CoordinatePair from "../../models/app/geofences/CoordinatePair";

export enum ShapePicker {
    Circular = "Circular",
    Polygon = "Polygon",
}

export const SELECT_SHAPE_PICKER = "SELECT_SHAPE_PICKER";
export const ENABLE_SHAPE_PICKER = "ENABLE_SHAPE_PICKER";
export const DISABLE_SHAPE_PICKER = "DISABLE_SHAPE_PICKER";
export const ADD_CIRCULAR_GEOFENCE = "ADD_CIRCULAR_GEOFENCE";
export const ADD_POLYGON_GEOFENCE = "ADD_POLYGON_GEOFENCE";
export const CLEAR_GEOFENCE = "CLEAR_GEOFENCE";

export interface GoogleMapsAction {
    type: string;
    googleMaps: GoogleMapsState;
}

export interface GoogleMapsState {
    selectedShapePicker: ShapePicker;
    shapePickerEnabled: boolean;
    circularGeoFence: CircularGeoFenceState;
    polygonGeoFence: PolygonGeoFenceState;
}

export interface CircularGeoFenceState {
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

export function addCircularGeoFence(circularGeoFence: CircularGeoFenceState): GoogleMapsAction {
    return {
        type: ADD_CIRCULAR_GEOFENCE,
        googleMaps: {
            circularGeoFence: circularGeoFence,
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
