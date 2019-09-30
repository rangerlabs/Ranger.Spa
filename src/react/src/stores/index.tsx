import { User } from 'oidc-client';
import { RouterState } from 'connected-react-router';
import { DialogState } from '../redux/actions/DialogActions';
import { MenuState } from '../redux/actions/MenuActions';
import IUser from '../models/app/IUser';
import IProject from '../models/app/IProject';
import { GoogleMapsState } from '../redux/actions/GoogleMapsActions';
import CircleGeoFence from '../models/app/geofences/CircleGeoFence';
import PolygonGeoFence from '../models/app/geofences/PolygonGeoFence';
import { GeoFenceDrawerState } from '../redux/actions/GeoFenceDrawerActions';
import { MergedIntegrationResponseType } from '../models/app/integrations/MergedIntegrationTypes';
import { DomainState } from '../redux/actions/DomainActions';
import { SnackbarNotification } from '../redux/actions/SnackbarActions';

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
    projects: IProject[];
    selectedProject: IProject;
    geofences: Array<CircleGeoFence | PolygonGeoFence>;
    geoFenceDrawer: GeoFenceDrawerState;
    googleMaps: GoogleMapsState;
    integrations: MergedIntegrationResponseType[];
    domain: DomainState;
    notifications: SnackbarNotification[];
}
