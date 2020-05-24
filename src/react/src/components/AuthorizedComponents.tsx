import Users from './app/users/Users';
import UserForm from './app/users/UserForm';
import Projects from './app/projects/Projects';
import RoutePaths from './RoutePaths';
import IAppRoute from './IAppRoute';
import ProjectForm from './app/projects/ProjectForm';
import Geofences from './app/geofences/Geofences';
import GeofenceForm from './app/geofences/googleMap/GeofenceForm';
import Integrations from './app/integrations/Integrations';
import IntegrationsNew from './app/integrations/form/IntegrationsNew';
import IntegrationsNewWebhook from './app/integrations/form/WebhookIntegrationForm';
import ProjectsSelect from './app/projects/ProjectSelect';
import Dashboard from './app/dashboard/Dashboard';
import BreadcrumbPaths from './BreadcrumbPaths';
import { IntegrationEnum } from '../models/app/integrations/IntegrationEnum';
import Account from './app/account/Account';
import FirstProjectRequired from './app/projects/FirstProjectRequired';
import Domain from './app/domain/Domain';
import Subscription from './app/subscription/Subscription';

export const AuthorizedComponents: IAppRoute[] = [
    { exact: true, path: RoutePaths.Dashboard, component: Dashboard, breadcrumbPath: BreadcrumbPaths.Dashboard() },
    { exact: true, path: RoutePaths.Account, component: Account, breadcrumbPath: BreadcrumbPaths.Account() },
    { exact: true, path: RoutePaths.Domain, component: Domain, breadcrumbPath: BreadcrumbPaths.Domain() },
    { exact: true, path: RoutePaths.Subscription, component: Subscription, breadcrumbPath: BreadcrumbPaths.Subscription() },

    { exact: true, path: RoutePaths.Users, component: Users, breadcrumbPath: BreadcrumbPaths.Users() },
    { exact: true, path: RoutePaths.UsersNew, component: UserForm, breadcrumbPath: BreadcrumbPaths.UsersNew() },
    { exact: true, path: RoutePaths.UsersEdit, component: UserForm, breadcrumbPath: BreadcrumbPaths.UsersEdit() },

    { exact: true, path: RoutePaths.Projects, component: Projects, breadcrumbPath: BreadcrumbPaths.Projects() },
    { exact: true, path: RoutePaths.FirstProjectRequired, component: FirstProjectRequired, breadcrumbPath: BreadcrumbPaths.Projects() },
    { exact: true, path: RoutePaths.ProjectsSelect, component: ProjectsSelect, breadcrumbPath: BreadcrumbPaths.ProjectsSelect() },
    { exact: true, path: RoutePaths.ProjectsNew, component: ProjectForm, breadcrumbPath: BreadcrumbPaths.ProjectsNew() },
    { exact: false, path: RoutePaths.ProjectsEdit, component: ProjectForm, breadcrumbPath: BreadcrumbPaths.ProjectsEdit() },

    { exact: true, path: [RoutePaths.GeofenceMap, RoutePaths.GeofencesEdit], component: GeofenceForm, breadcrumbPath: BreadcrumbPaths.GeofenceMap() },
    { exact: true, path: RoutePaths.GeofenceTable, component: Geofences, breadcrumbPath: BreadcrumbPaths.GeofenceTable() },

    { exact: true, path: RoutePaths.Integrations, component: Integrations, breadcrumbPath: BreadcrumbPaths.Integrations() },
    { exact: true, path: RoutePaths.IntegrationsNew, component: IntegrationsNew, breadcrumbPath: BreadcrumbPaths.IntegrationsNew() },
    {
        exact: true,
        path: RoutePaths.IntegrationsEditWebhook,
        component: IntegrationsNewWebhook,
        breadcrumbPath: BreadcrumbPaths.IntegrationsEdit(IntegrationEnum.WEBHOOK),
    },
    {
        exact: true,
        path: RoutePaths.IntegrationsNewWebhook,
        component: IntegrationsNewWebhook,
        breadcrumbPath: BreadcrumbPaths.IntegrationsNew(IntegrationEnum.WEBHOOK),
    },
];
