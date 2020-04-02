import IProject from '../../models/app/IProject';

export const ADD_PROJECT = 'ADD_PROJECT';
export const REMOVE_PROJECT = 'REMOVE_PROJECT';
export const POPULATE_PROJECTS = 'POPULATE_PROJECTS';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';

export interface ProjectAction {
    type: string;
    project: IProject;
}

export interface ProjectArrayAction {
    type: string;
    projectsState: ProjectsState;
}

export interface ProjectsState {
    projects: Array<IProject>;
    isLoaded: boolean;
}

export function updateProject(project: IProject): ProjectAction {
    return {
        type: UPDATE_PROJECT,
        project,
    };
}

export function addProject(project: IProject): ProjectAction {
    return {
        type: ADD_PROJECT,
        project,
    };
}
export function removeProject(projectId: string): ProjectAction {
    return {
        type: REMOVE_PROJECT,
        project: { projectId: projectId } as IProject,
    };
}

export function populateProjects(projects: Array<IProject>): ProjectArrayAction {
    return {
        type: POPULATE_PROJECTS,
        projectsState: {
            isLoaded: true,
            projects,
        },
    };
}
