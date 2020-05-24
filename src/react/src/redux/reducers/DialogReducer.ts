import { CLOSE_DIALOG, DialogAction, OPEN_DIALOG, DialogState } from '../actions/DialogActions';

export function dialogReducer(state = {} as DialogState, action: DialogAction) {
    switch (action.type) {
        case OPEN_DIALOG:
        case CLOSE_DIALOG:
            return Object.assign({}, action.dialog);
        default:
            return state;
    }
}
