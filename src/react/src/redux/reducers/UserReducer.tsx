import { ADD_USER, REMOVE_USER, POPULATE_USERS, UserAction, UserArrayAction, UsersState, UPDATE_USER } from '../actions/UserActions';
import IUser from '../../models/app/IUser';

export function userReducer(state: UsersState = { isLoaded: false, users: [] }, action: UserAction & UserArrayAction) {
    switch (action.type) {
        case ADD_USER:
            const index = state.users.findIndex((v: IUser) => v.lastName > action.user.lastName);
            let newArray = state.users.slice();
            newArray.splice(index, 0, action.user);
            return Object.assign({}, state, { users: newArray });
        case UPDATE_USER: {
            const index = state.users.findIndex((v: IUser) => v.email === action.user.email);
            let newArray = state.users.slice();
            newArray.splice(index, 1, action.user);
            return Object.assign({}, state, { users: newArray });
        }
        case REMOVE_USER:
            return Object.assign({}, state, { users: state.users.filter((v: IUser) => v.email !== action.user.email) });
        case POPULATE_USERS:
            return Object.assign({}, state, action.usersState);
        default:
            return state;
    }
}
