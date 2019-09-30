import { POPULATE_GEOFENCES, GeoFenceAction, GeoFenceArrayAction, REMOVE_GEOFENCE, ADD_GEOFENCE } from '../actions/GeoFenceActions';
import GeoFence from '../../models/app/geofences/GeoFence';
import CircleGeoFence from '../../models/app/geofences/CircleGeoFence';
import PolygonGeoFence from '../../models/app/geofences/PolygonGeoFence';

export function geoFenceReducer(
    state: Array<CircleGeoFence | PolygonGeoFence> = [],
    action: GeoFenceAction & GeoFenceArrayAction
): (CircleGeoFence | PolygonGeoFence)[] {
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
