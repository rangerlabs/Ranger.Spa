import {
    UserAction,
    UsersState,
    UserArrayAction,
    ADD_USER,
    UPDATE_USER_BY_CORRELATION_ID,
    UPDATE_USER_BY_EMAIL,
    UNDO_PENDING_DELETE_USER_BY_CORRELATION_ID,
    REMOVE_PENDING_DELETE_USER_BY_CORRELATION_ID,
    UNDO_PENDING_UPDATE_USER_BY_CORRELATION_ID,
    REMOVE_PENDING_UPDATE_USER_BY_EMAIL,
    ADD_USER_TO_PENDING_DELETION,
    ADD_USER_TO_PENDING_UPDATE,
    REMOVE_USER_BY_EMAIL,
    REMOVE_USER_BY_CORRELATION_ID,
    POPULATE_USERS,
} from '../actions/UserActions';
import IUser from '../../models/app/IUser';

export function userReducer(state: UsersState = { isLoaded: false, users: [], pendingUpdate: [], pendingDeletion: [] }, action: UserAction & UserArrayAction) {
    switch (action.type) {
        case ADD_USER: {
            return Object.assign({}, state, { users: state.users.concat(action.user) });
        }
        case UPDATE_USER_BY_CORRELATION_ID: {
            var userIndex = state.users.findIndex((g) => g.correlationModel?.correlationId === action.user.correlationModel.correlationId);
            var updatedUser = state.users[userIndex];
            updatedUser.correlationModel.status = action.user.correlationModel.status;
            updatedUser.id = action.user.correlationModel.resourceId;
            let newArray = state.users.slice();
            newArray.splice(userIndex, 1, updatedUser);
            return Object.assign({}, state, { users: newArray });
        }
        case UPDATE_USER_BY_EMAIL: {
            {
                const userIndex = state.users.findIndex((g) => g.id == action.user.id);
                let newArray = state.users.slice();
                newArray.splice(userIndex, 1, action.user);
                return Object.assign({}, state, { users: newArray });
            }
        }
        case UNDO_PENDING_DELETE_USER_BY_CORRELATION_ID: {
            const userToRestore = state.pendingDeletion.find((v: IUser) => v.correlationModel.correlationId === action.user.correlationModel.correlationId);
            return Object.assign({}, state, {
                users: state.users.concat(userToRestore),
                pendingDeletion: state.pendingDeletion.filter((v: IUser) => v.correlationModel.correlationId !== action.user.correlationModel.correlationId),
            });
        }
        case REMOVE_PENDING_DELETE_USER_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.filter((v: IUser) => v.correlationModel.correlationId !== action.user.correlationModel.correlationId),
            });
        }
        case UNDO_PENDING_UPDATE_USER_BY_CORRELATION_ID: {
            const idToRestore = state.users.find((v: IUser) => v.correlationModel?.correlationId === action.user.correlationModel.correlationId).id;
            const userToRestore = state.pendingUpdate.find((v: IUser) => v.id === idToRestore);
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v: IUser) => v.id !== idToRestore),
                users: state.users.filter((v: IUser) => v.id !== idToRestore).concat(userToRestore),
            });
        }
        case REMOVE_PENDING_UPDATE_USER_BY_EMAIL: {
            return Object.assign({}, state, {
                pendingUpdate: state.pendingUpdate.filter((v: IUser) => v.email !== action.user.email),
            });
        }
        case ADD_USER_TO_PENDING_DELETION: {
            return Object.assign({}, state, {
                pendingDeletion: state.pendingDeletion.concat(action.user),
            });
        }
        case ADD_USER_TO_PENDING_UPDATE: {
            return Object.assign({}, state, { pendingUpdate: state.pendingDeletion.concat(action.user) });
        }
        case REMOVE_USER_BY_EMAIL: {
            return Object.assign({}, state, {
                users: state.users.filter((v: IUser) => v.email !== action.user.email),
            });
        }
        case REMOVE_USER_BY_CORRELATION_ID: {
            return Object.assign({}, state, {
                users: state.users.filter((v: IUser) => v.correlationModel?.correlationId !== action.user.correlationModel.correlationId),
            });
        }
        case POPULATE_USERS: {
            return Object.assign({}, state, action.usersState);
        }
        default:
            return state;
    }
}
