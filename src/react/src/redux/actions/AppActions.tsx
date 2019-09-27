import IApp from '../../models/app/IApp';

export const ADD_APP = 'ADD_APP';
export const REMOVE_APP = 'REMOVE_APP';
export const POPULATE_APPS = 'POPULATE_APPS';
export const FILTER_APP = 'FILTER_APP';

export interface AppAction {
    type: string;
    app: IApp;
}

export interface AppArrayAction {
    type: string;
    apps: Array<IApp>;
}

export function addApp(app: IApp): AppAction {
    return {
        type: ADD_APP,
        app,
    };
}
export function removeApp(id: string): AppAction {
    return {
        type: REMOVE_APP,
        app: { id: id } as IApp,
    };
}
export function populateApps(apps: Array<IApp>): AppArrayAction {
    return {
        type: POPULATE_APPS,
        apps,
    };
}
