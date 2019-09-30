import IProject from '../../models/app/IProject';

export const SELECTED_PROJECT = 'SELECTED_PROJECT';
export const CLEAR_SELECTED_PROJECT = 'CLEAR_SELECTED_PROJECT';

export interface SelectedProjectAction {
    type: string;
    selectedProject: IProject;
}

export function selectProject(selectedProject: IProject): SelectedProjectAction {
    return {
        type: SELECTED_PROJECT,
        selectedProject,
    };
}

export function clearSelectProject(): SelectedProjectAction {
    return {
        type: CLEAR_SELECTED_PROJECT,
        selectedProject: undefined,
    };
}
