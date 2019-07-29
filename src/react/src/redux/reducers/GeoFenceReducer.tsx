import { POPULATE_GEOFENCES, GeoFenceAction, GeoFenceArrayAction, REMOVE_GEOFENCE, ADD_GEOFENCE } from "../actions/GeoFenceActions";
import GeoFence from "../../models/app/geofences/GeoFence";
import CircularGeoFence from "../../models/app/geofences/CircularGeoFence";
import PolygonGeoFence from "../../models/app/geofences/PolygonGeoFence";

export function geoFenceReducer(
    state: Array<CircularGeoFence | PolygonGeoFence> = [],
    action: GeoFenceAction & GeoFenceArrayAction
): (CircularGeoFence | PolygonGeoFence)[] {
    switch (action.type) {
        case ADD_GEOFENCE:
            return state.concat(action.geoFence);
        case REMOVE_GEOFENCE:
            return state.filter((v: GeoFence) => v.name !== action.geoFence.name);
        case POPULATE_GEOFENCES:
            return action.geoFences;
        default:
            return state;
    }
}
