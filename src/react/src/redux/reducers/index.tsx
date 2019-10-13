import { dialogReducer } from './DialogReducer';
import { userReducer } from './UserReducer';
import { projectReducer } from './ProjectReducer';
import { menuReducer } from './MenuReducer';
import { geofenceReducer } from './GeofenceReducer';
import { geofenceDrawerReducer } from './GeofenceDrawerReducer';
import { googleMapsReducer } from './GoogleMapsReducer';
import { selectedProjectReducer } from './SelectedProjectReducer';
import { integrationReducer } from './IntegrationReducer';
import { domainReducer } from './DomainReducer';
import { snackbarReducer } from './SnackbarReducer';
import { reducer as oidcReducer } from 'redux-oidc';

const reducers = {
    oidc: oidcReducer,
    dialog: dialogReducer,
    users: userReducer,
    projectsState: projectReducer,
    selectedProject: selectedProjectReducer,
    menu: menuReducer,
    geofencesState: geofenceReducer,
    geofenceDrawer: geofenceDrawerReducer,
    googleMaps: googleMapsReducer,
    integrationsState: integrationReducer,
    domain: domainReducer,
    notifications: snackbarReducer,
};

export default reducers;
