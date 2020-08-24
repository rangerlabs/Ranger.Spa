import { dialogReducer } from './DialogReducer';
import { userReducer } from './UserReducer';
import { projectReducer } from './ProjectReducer';
import { menuReducer } from './MenuReducer';
import { geofenceReducer } from './GeofenceReducer';
import { geofenceDrawerReducer } from './GeofenceDrawerReducer';
import { googleMapsReducer } from './GoogleMapsReducer';
import { selectedProjectReducer } from './SelectedProjectReducer';
import { integrationReducer } from './IntegrationReducer';
import { organizationReducer } from './OrganizationReducer';
import { snackbarReducer } from './SnackbarReducer';
import { reducer as oidcReducer } from 'redux-oidc';
import { subscriptionLimitDetailsReducer } from './SubscriptionLimitDetailsReducer';
import { accountReducer } from './AccountReducer';

const reducers = {
    oidc: oidcReducer,
    dialog: dialogReducer,
    usersState: userReducer,
    projectsState: projectReducer,
    selectedProject: selectedProjectReducer,
    menu: menuReducer,
    geofencesState: geofenceReducer,
    geofenceDrawer: geofenceDrawerReducer,
    googleMaps: googleMapsReducer,
    integrationsState: integrationReducer,
    organizationState: organizationReducer,
    notifications: snackbarReducer,
    subscriptionLimitDetailsState: subscriptionLimitDetailsReducer,
    accountState: accountReducer,
};

export default reducers;
