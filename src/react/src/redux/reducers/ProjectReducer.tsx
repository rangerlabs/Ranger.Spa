import { ADD_PROJECT, REMOVE_PROJECT, POPULATE_PROJECTS, ProjectAction, ProjectArrayAction, ProjectsState } from '../actions/ProjectActions';
import IProject from '../../models/app/IProject';

export function projectReducer(state: ProjectsState = { isLoaded: false, projects: [] }, action: ProjectAction & ProjectArrayAction) {
    switch (action.type) {
        case ADD_PROJECT:
            return Object.assign({}, state, state.projects.concat(action.project));
        case REMOVE_PROJECT:
            return Object.assign({}, state, state.projects.filter((v: IProject) => v.name !== action.project.name));
        case POPULATE_PROJECTS:
            return Object.assign({}, state, action.projectsState);
        default:
            return state;
    }
}
