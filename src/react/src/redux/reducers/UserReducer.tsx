import { ADD_USER, REMOVE_USER, POPULATE_USERS, UserAction, UserArrayAction } from "../actions/UserActions";
import IUser from "../../models/app/IUser";

export function userReducer(state: IUser[] = [], action: UserAction & UserArrayAction) {
    switch (action.type) {
        case ADD_USER:
            return state.concat(action.user);
        case REMOVE_USER:
            return state.filter((v: IUser) => v.email !== action.user.email);
        case POPULATE_USERS:
            return action.users;
        default:
            return state;
    }
}
