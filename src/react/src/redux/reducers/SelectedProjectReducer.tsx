import { SelectedProjectAction, SELECTED_PROJECT, CLEAR_SELECTED_PROJECT } from '../actions/SelecteProjectActions';

export function selectedProjectReducer(state: string = '', action: SelectedProjectAction) {
    switch (action.type) {
        case SELECTED_PROJECT:
            return action.selectedProject;
        case CLEAR_SELECTED_PROJECT:
            return action.selectedProject;
        default:
            return state;
    }
}
