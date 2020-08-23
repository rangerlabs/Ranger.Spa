import IUser from '../../models/app/IUser';
import CorrelationModel from '../../models/CorrelationModel';

export const ADD_USER = 'ADD_USER';
export const POPULATE_USERS = 'POPULATE_USERS';

export const UPDATE_USER_BY_CORRELATION_ID = 'UPDATE_USER_BY_CORRELATION_ID';
export const UPDATE_USER_BY_EMAIL = 'UPDATE_USER_BY_EMAIL';
export const REMOVE_PENDING_DELETE_USER_BY_CORRELATION_ID = 'REMOVE_PENDING_DELETE_USER_BY_CORRELATION_ID';
export const UNDO_PENDING_DELETE_USER_BY_CORRELATION_ID = 'UNDO_PENDING_DELETE_USER_BY_CORRELATION_ID';
export const REMOVE_PENDING_UPDATE_USER_BY_EMAIL = 'REMOVE_PENDING_UPDATE_USER_BY_EMAIL';
export const UNDO_PENDING_UPDATE_USER_BY_CORRELATION_ID = 'UNDO_PENDING_UPDATE_USER_BY_CORRELATION_ID';
export const REMOVE_USER_BY_CORRELATION_ID = 'REMOVE_USER_BY_CORRELATION_ID';
export const ADD_USER_TO_PENDING_DELETION = 'MOVE_USER_TO_PENDING_DELETION';
export const ADD_USER_TO_PENDING_UPDATE = 'ADD_USER_TO_PENDING_UDPATE';
export const REMOVE_USER_BY_EMAIL = 'REMOVE_USER_BY_EMAIL';

export interface UserAction {
    type: string;
    user: IUser;
}

export interface UserArrayAction {
    type: string;
    usersState: UsersState;
}

export interface UsersState {
    isLoaded: boolean;
    users: Array<IUser>;
    pendingUpdate: Array<IUser>;
    pendingDeletion: Array<IUser>;
}

export function addUser(user: IUser): UserAction {
    return {
        type: ADD_USER,
        user,
    };
}

export function updateUserByCorrelationId(correlationModel: CorrelationModel) {
    return {
        type: UPDATE_USER_BY_CORRELATION_ID,
        user: { correlationModel: correlationModel } as IUser,
    };
}

export function updateUserByEmail(user: IUser) {
    return {
        type: UPDATE_USER_BY_EMAIL,
        user,
    };
}

export function removePendingDeleteUserByCorrelationId(correlationId: string): UserAction {
    return {
        type: REMOVE_PENDING_DELETE_USER_BY_CORRELATION_ID,
        user: { correlationModel: { correlationId: correlationId } as CorrelationModel } as IUser,
    };
}

export function undoPendingDeleteUserByCorrelationId(correlationId: string): UserAction {
    return {
        type: UNDO_PENDING_DELETE_USER_BY_CORRELATION_ID,
        user: { correlationModel: { correlationId: correlationId } as CorrelationModel } as IUser,
    };
}

export function removePendingUpdateUserById(id: string): UserAction {
    return {
        type: REMOVE_PENDING_UPDATE_USER_BY_EMAIL,
        user: { id: id } as IUser,
    };
}

export function undoPendingUpdateUserByCorrelationId(correlationId: string): UserAction {
    return {
        type: UNDO_PENDING_UPDATE_USER_BY_CORRELATION_ID,
        user: { correlationModel: { correlationId: correlationId } as CorrelationModel } as IUser,
    };
}

export function addUserToPendingDeletion(user: IUser): UserAction {
    return {
        type: ADD_USER_TO_PENDING_DELETION,
        user,
    };
}

export function addUserToPendingUpdate(user: IUser): UserAction {
    return {
        type: ADD_USER_TO_PENDING_UPDATE,
        user,
    };
}

export function removeUserByName(email: string): UserAction {
    return {
        type: REMOVE_USER_BY_EMAIL,
        user: { email: email } as IUser,
    };
}

export function removeUserByCorrelationId(correlationId: string): UserAction {
    return {
        type: REMOVE_USER_BY_CORRELATION_ID,
        user: { correlationModel: { correlationId: correlationId } as CorrelationModel } as IUser,
    };
}

export function populateUsers(users: Array<IUser>): UserArrayAction {
    return {
        type: POPULATE_USERS,
        usersState: {
            isLoaded: true,
            users,
            pendingUpdate: [],
            pendingDeletion: [],
        },
    };
}
