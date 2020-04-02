import { User } from 'oidc-client';
import { RouterState } from 'connected-react-router';
import { DialogState } from '../redux/actions/DialogActions';
import { MenuState } from '../redux/actions/MenuActions';
import IProject from '../models/app/IProject';
import { GoogleMapsState } from '../redux/actions/GoogleMapsActions';
import { GeofenceDrawerState } from '../redux/actions/GeofenceDrawerActions';
import { DomainState } from '../redux/actions/DomainActions';
import { SnackbarNotification } from '../redux/actions/SnackbarActions';
import { ProjectsState } from '../redux/actions/ProjectActions';
import { GeofencesState } from '../redux/actions/GeofenceActions';
import { IntegrationsState } from '../redux/actions/IntegrationActions';
import { UsersState } from '../redux/actions/UserActions';
import { SubscriptionLimitDetailsState } from '../redux/actions/SubscriptionLimitDetailsActions';

export interface OidcState {
    isLoadingUser: boolean;
    user: User;
}

export interface ApplicationState {
    oidc: OidcState;
    dialog: DialogState;
    router: RouterState;
    menu: MenuState;
    usersState: UsersState;
    projectsState: ProjectsState;
    selectedProject: IProject;
    geofencesState: GeofencesState;
    geofenceDrawer: GeofenceDrawerState;
    googleMaps: GoogleMapsState;
    integrationsState: IntegrationsState;
    domain: DomainState;
    notifications: SnackbarNotification[];
    subscriptionLimitDetailsState: SubscriptionLimitDetailsState;
}
