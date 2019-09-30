import IProject from '../../models/app/IProject';

export const ADD_PROJECT = 'ADD_PROJECT';
export const REMOVE_PROJECT = 'REMOVE_PROJECT';
export const POPULATE_PROJECTS = 'POPULATE_PROJECTS';

export interface ProjectAction {
    type: string;
    project: IProject;
}

export interface ProjectArrayAction {
    type: string;
    projects: Array<IProject>;
}

export function addProject(project: IProject): ProjectAction {
    return {
        type: ADD_PROJECT,
        project,
    };
}
export function removeProject(name: string): ProjectAction {
    return {
        type: REMOVE_PROJECT,
        project: { name: name } as IProject,
    };
}
export function populateProjects(projects: Array<IProject>): ProjectArrayAction {
    return {
        type: POPULATE_PROJECTS,
        projects,
    };
}
