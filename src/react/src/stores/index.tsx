import { User } from "oidc-client";
import { RouterState } from "connected-react-router";
import { DialogState } from "../redux/actions/DialogActions";
import { MenuState } from "../redux/actions/MenuActions";
import IUser from "../models/app/IUser";
import IApp from "../models/app/IApp";
import { GoogleMapsState } from "../redux/actions/GoogleMapsActions";
import CircularGeoFence from "../models/app/geofences/CircularGeoFence";
import PolygonGeoFence from "../models/app/geofences/PolygonGeoFence";
import { GeoFenceDrawerState } from "../redux/actions/GeoFenceDrawerActions";
import { MergedIntegrationType } from "../models/app/integrations/MergedIntegrationType";
import { DomainState } from "../redux/actions/DomainActions";
import { SnackbarNotification } from "../redux/actions/SnackbarActions";

export interface OidcState {
    isLoadingUser: boolean;
    user: User;
}

export interface ApplicationState {
    oidc: OidcState;
    dialog: DialogState;
    router: RouterState;
    menu: MenuState;
    users: IUser[];
    apps: IApp[];
    selectedApp: string;
    geofences: Array<CircularGeoFence | PolygonGeoFence>;
    geoFenceDrawer: GeoFenceDrawerState;
    googleMaps: GoogleMapsState;
    integrations: MergedIntegrationType[];
    domain: DomainState;
    notifications: SnackbarNotification[];
}
