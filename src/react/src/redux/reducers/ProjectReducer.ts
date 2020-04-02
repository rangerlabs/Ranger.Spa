import { ADD_PROJECT, REMOVE_PROJECT, POPULATE_PROJECTS, UPDATE_PROJECT, ProjectAction, ProjectArrayAction, ProjectsState } from '../actions/ProjectActions';
import IProject from '../../models/app/IProject';

export function projectReducer(state: ProjectsState = { isLoaded: false, projects: [] }, action: ProjectAction & ProjectArrayAction) {
    switch (action.type) {
        case UPDATE_PROJECT:
            return Object.assign({}, state, {
                projects: state.projects.filter((p: IProject) => p.projectId !== action.project.projectId).concat(action.project),
            } as ProjectsState);
        case ADD_PROJECT:
            return Object.assign({}, state, { projects: state.projects.concat(action.project) } as ProjectsState);
        case REMOVE_PROJECT:
            return Object.assign({}, state, { projects: state.projects.filter((p: IProject) => p.projectId !== action.project.projectId) } as ProjectsState);
        case POPULATE_PROJECTS:
            return Object.assign({}, state, action.projectsState);
        default:
            return state;
    }
}
