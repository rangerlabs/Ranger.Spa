import { POPULATE_GEOFENCES, GeofenceAction, GeofenceArrayAction, REMOVE_GEOFENCE, ADD_GEOFENCE, GeofencesState } from '../actions/GeofenceActions';
import Geofence from '../../models/app/geofences/Geofence';

export function geofenceReducer(state: GeofencesState = { isLoaded: false, geofences: [] }, action: GeofenceAction & GeofenceArrayAction) {
    switch (action.type) {
        case ADD_GEOFENCE:
            return Object.assign({}, state, state.geofences.concat(action.geofence));
        case REMOVE_GEOFENCE:
            return Object.assign({}, state, state.geofences.filter((v: Geofence) => v.name !== action.geofence.name));
        case POPULATE_GEOFENCES:
            return Object.assign({}, state, action.geofencesState);
        default:
            return state;
    }
}
