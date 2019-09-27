import IApp from '../../models/app/IApp';

export const SELECTED_APP = 'SELECTED_APP';
export const CLEAR_SELECTED_APP = 'CLEAR_SELECTED_APP';

export interface SelectedAppAction {
    type: string;
    selectedApp: IApp;
}

export function selectApp(selectedApp: IApp): SelectedAppAction {
    return {
        type: SELECTED_APP,
        selectedApp,
    };
}

export function clearSelectApp(): SelectedAppAction {
    return {
        type: CLEAR_SELECTED_APP,
        selectedApp: undefined,
    };
}
