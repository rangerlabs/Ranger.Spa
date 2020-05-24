import { SelectedProjectAction, SELECTED_PROJECT } from '../actions/SelecteProjectActions';
import IProject from '../../models/app/IProject';

export function selectedProjectReducer(state = {} as IProject, action: SelectedProjectAction) {
    switch (action.type) {
        case SELECTED_PROJECT:
            return Object.assign({}, action.selectedProject);
        default:
            return state;
    }
}
