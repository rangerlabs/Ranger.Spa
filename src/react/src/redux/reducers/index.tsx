import { dialogReducer } from './DialogReducer';
import { userReducer } from './UserReducer';
import { projectReducer } from './ProjectReducer';
import { menuReducer } from './MenuReducer';
import { geoFenceReducer } from './GeoFenceReducer';
import { geoFenceDrawerReducer } from './GeoFenceDrawerReducer';
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
    projects: projectReducer,
    selectedProject: selectedProjectReducer,
    menu: menuReducer,
    geofences: geoFenceReducer,
    geoFenceDrawer: geoFenceDrawerReducer,
    googleMaps: googleMapsReducer,
    integrations: integrationReducer,
    domain: domainReducer,
    notifications: snackbarReducer,
};

export default reducers;
