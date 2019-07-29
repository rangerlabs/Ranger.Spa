import { dialogReducer } from "./DialogReducer";
import { userReducer } from "./UserReducer";
import { appReducer } from "./AppReducer";
import { menuReducer } from "./MenuReducer";
import { geoFenceReducer } from "./GeoFenceReducer";
import { geoFenceDrawerReducer } from "./GeoFenceDrawerReducer";
import { googleMapsReducer } from "./GoogleMapsReducer";
import { selectedAppReducer } from "./SelectedAppReducer";
import { integrationReducer } from "./IntegrationReducer";
import { domainReducer } from "./DomainReducer";
import { snackbarReducer } from "./SnackbarReducer";
import { reducer as oidcReducer } from "redux-oidc";

const reducers = {
    oidc: oidcReducer,
    dialog: dialogReducer,
    users: userReducer,
    apps: appReducer,
    selectedApp: selectedAppReducer,
    menu: menuReducer,
    geofences: geoFenceReducer,
    geoFenceDrawer: geoFenceDrawerReducer,
    googleMaps: googleMapsReducer,
    integrations: integrationReducer,
    domain: domainReducer,
    notifications: snackbarReducer,
};

export default reducers;
