import { ADD_PROJECT, REMOVE_PROJECT, POPULATE_PROJECTS, ProjectAction, ProjectArrayAction } from '../actions/ProjectActions';
import IProject from '../../models/app/IProject';

export function projectReducer(state: IProject[] = [], action: ProjectAction & ProjectArrayAction) {
    switch (action.type) {
        case ADD_PROJECT:
            return state.concat(action.project);
        case REMOVE_PROJECT:
            return state.filter((v: IProject) => v.name !== action.project.name);
        case POPULATE_PROJECTS:
            return action.projects;
        default:
            return state;
    }
}
