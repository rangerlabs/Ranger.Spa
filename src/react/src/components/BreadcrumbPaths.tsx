import Breadcrumb from '../models/app/Breadcrumb';
import BreadcrumbPath from '../models/app/BreadcrumbPath';
import RoutePaths from './RoutePaths';
import { IntegrationEnum } from '../models/app/integrations/IntegrationEnum';
import { titleCase } from 'change-case';

const dashboardBreadcrumb = new Breadcrumb('Dashboard', RoutePaths.Dashboard);
const accountBreadcrumb = new Breadcrumb('Account', RoutePaths.Account);
const domainBreadcrumb = new Breadcrumb('Domain', RoutePaths.Domain);

const geofenceMapBreadcrumb = new Breadcrumb('Geofence Map', RoutePaths.GeofenceMap);
const geofenceTableBreadcrumb = new Breadcrumb('Geofence Table', RoutePaths.GeofenceTable);

const integrationsBreadcrumb = new Breadcrumb('Integrations', RoutePaths.Integrations);
const integrationsNewBreadcrumb = new Breadcrumb('New', RoutePaths.IntegrationsNew);
const integrationsEditBreadcrumb = new Breadcrumb('Edit', RoutePaths.Integrations);

const usersBreadcrumb = new Breadcrumb('Users', RoutePaths.Users);
const usersNewBreadcrumb = new Breadcrumb('New', RoutePaths.UsersNew);
const usersEditBreadcrumb = new Breadcrumb('Edit', RoutePaths.UsersEdit);

const firstProjectRequiredBreadcrumb = new Breadcrumb('First Project', RoutePaths.ProjectsNew);
const projectsBreadcrumb = new Breadcrumb('Projects', RoutePaths.Projects);
const projectsNewBreadcrumb = new Breadcrumb('New', RoutePaths.ProjectsNew);
const projectsEditBreadcrumb = new Breadcrumb('Edit', RoutePaths.ProjectsEdit);

export default class BreadcrumbPaths {
    public static Dashboard() {
        return new BreadcrumbPath(new Array<Breadcrumb>(dashboardBreadcrumb));
    }

    public static Account() {
        return new BreadcrumbPath(new Array<Breadcrumb>(accountBreadcrumb));
    }

    public static Domain() {
        return new BreadcrumbPath(new Array<Breadcrumb>(domainBreadcrumb));
    }

    public static GeofenceMap() {
        return new BreadcrumbPath(new Array<Breadcrumb>(geofenceMapBreadcrumb), true);
    }

    public static GeofenceTable() {
        return new BreadcrumbPath(new Array<Breadcrumb>(geofenceTableBreadcrumb), true);
    }

    public static Integrations() {
        return new BreadcrumbPath(new Array<Breadcrumb>(integrationsBreadcrumb), true);
    }

    public static IntegrationsEdit(integration?: IntegrationEnum) {
        const result = new BreadcrumbPath(new Array<Breadcrumb>(integrationsBreadcrumb, integrationsEditBreadcrumb), true);
        if (integration) {
            let integrationBreadcrumb = undefined;
            switch (integration) {
                case IntegrationEnum.WEBHOOK: {
                    integrationBreadcrumb = new Breadcrumb(titleCase(IntegrationEnum.WEBHOOK), RoutePaths.IntegrationsEditWebhook);
                    break;
                }
            }
            result.breadcrumbs.push(integrationBreadcrumb);
        }
        return result;
    }

    public static IntegrationsNew(integration?: IntegrationEnum) {
        const result = new BreadcrumbPath(new Array<Breadcrumb>(integrationsBreadcrumb, integrationsNewBreadcrumb), true);
        if (integration) {
            let integrationBreadcrumb = undefined;
            switch (integration) {
                case IntegrationEnum.WEBHOOK: {
                    integrationBreadcrumb = new Breadcrumb(titleCase(IntegrationEnum.WEBHOOK), RoutePaths.IntegrationsNewWebhook);
                    break;
                }
            }
            result.breadcrumbs.push(integrationBreadcrumb);
        }
        return result;
    }

    public static Users() {
        return new BreadcrumbPath(new Array<Breadcrumb>(usersBreadcrumb));
    }

    public static UsersNew() {
        return new BreadcrumbPath(new Array<Breadcrumb>(usersBreadcrumb, usersNewBreadcrumb));
    }

    public static UsersEdit() {
        return new BreadcrumbPath(new Array<Breadcrumb>(usersBreadcrumb, usersEditBreadcrumb));
    }

    public static Projects() {
        return new BreadcrumbPath(new Array<Breadcrumb>(projectsBreadcrumb));
    }

    public static FirstProjectRequired() {
        return new BreadcrumbPath(new Array<Breadcrumb>(firstProjectRequiredBreadcrumb));
    }

    public static ProjectsNew() {
        return new BreadcrumbPath(new Array<Breadcrumb>(projectsBreadcrumb, projectsNewBreadcrumb));
    }

    public static ProjectsEdit() {
        return new BreadcrumbPath(new Array<Breadcrumb>(projectsBreadcrumb, projectsEditBreadcrumb));
    }

    public static ProjectsSelect() {
        return new BreadcrumbPath(new Array<Breadcrumb>(projectsBreadcrumb));
    }

    public static GetProjectBreadCrumb(projectName: string) {
        if (!projectName) {
            throw new Error('appName parameter is required');
        }
        return new Breadcrumb(projectName, RoutePaths.ProjectsSelect);
    }
}
