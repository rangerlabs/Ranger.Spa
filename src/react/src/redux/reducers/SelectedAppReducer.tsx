import { SelectedAppAction, SELECTED_APP, CLEAR_SELECTED_APP } from "../actions/SelectedAppActions";

export function selectedAppReducer(state: string = "", action: SelectedAppAction) {
    switch (action.type) {
        case SELECTED_APP:
            return action.selectedApp;
        case CLEAR_SELECTED_APP:
            return action.selectedApp;
        default:
            return state;
    }
}
