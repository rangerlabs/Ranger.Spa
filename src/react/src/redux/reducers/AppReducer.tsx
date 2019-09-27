import { ADD_APP, REMOVE_APP, POPULATE_APPS, AppAction, AppArrayAction } from '../actions/AppActions';
import IApp from '../../models/app/IApp';

export function appReducer(state: IApp[] = [], action: AppAction & AppArrayAction) {
    switch (action.type) {
        case ADD_APP:
            return state.concat(action.app);
        case REMOVE_APP:
            return state.filter((v: IApp) => v.id !== action.app.id);
        case POPULATE_APPS:
            return action.apps;
        default:
            return state;
    }
}
