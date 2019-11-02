import { ADD_USER, REMOVE_USER, POPULATE_USERS, UserAction, UserArrayAction, UsersState } from '../actions/UserActions';
import IUser from '../../models/app/IUser';

export function userReducer(state: UsersState = { isLoaded: false, users: [] }, action: UserAction & UserArrayAction) {
    switch (action.type) {
        case ADD_USER:
            return Object.assign({}, state, state.users.concat(action.user));
        case REMOVE_USER:
            return Object.assign({}, state, state.users.filter((v: IUser) => v.email !== action.user.email));
        case POPULATE_USERS:
            return Object.assign({}, state, action.usersState);
        default:
            return state;
    }
}
