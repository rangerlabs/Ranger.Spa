import IUser from "../../models/app/IUser";

export const ADD_USER = "ADD_USER";
export const REMOVE_USER = "REMOVE_USER";
export const POPULATE_USERS = "POPULATE_USERS";

export interface UserAction {
    type: string;
    user: IUser;
}

export interface UserArrayAction {
    type: string;
    users: Array<IUser>;
}

export function addUser(user: IUser): UserAction {
    return {
        type: ADD_USER,
        user,
    };
}
export function removeUser(email: string): UserAction {
    return {
        type: REMOVE_USER,
        user: { email: email } as IUser,
    };
}
export function populateUsers(users: Array<IUser>): UserArrayAction {
    return {
        type: POPULATE_USERS,
        users,
    };
}
