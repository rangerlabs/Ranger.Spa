import Breadcrumb from "../models/app/Breadcrumb";
import BreadcrumbPath from "../models/app/BreadcrumbPath";
import RoutePaths from "./RoutePaths";
import { IntegrationEnum } from "../models/app/integrations/IntegrationEnum";
import { titleCase } from "change-case";

const dashboardBreadcrumb = new Breadcrumb("Dashboard", RoutePaths.Dashboard);
const accountBreadcrumb = new Breadcrumb("Account", RoutePaths.Account);
const geoFenceMapBreadcrumb = new Breadcrumb("Geofence Map", RoutePaths.GeoFenceMap);
const geoFenceTableBreadcrumb = new Breadcrumb("Geofence Table", RoutePaths.GeoFenceTable);

const integrationsBreadcrumb = new Breadcrumb("Integrations", RoutePaths.Integrations);
const integrationsNewBreadcrumb = new Breadcrumb("New", RoutePaths.IntegrationsNew);
const integrationsEditBreadcrumb = new Breadcrumb("Edit", RoutePaths.Integrations);

const usersBreadcrumb = new Breadcrumb("Users", RoutePaths.Users);
const usersNewBreadcrumb = new Breadcrumb("New", RoutePaths.UsersNew);
const usersEditBreadcrumb = new Breadcrumb("Edit", RoutePaths.UsersEdit);

const appsBreadcrumb = new Breadcrumb("Applications", RoutePaths.Apps);
const appsNewBreadcrumb = new Breadcrumb("New", RoutePaths.AppsNew);
const appsEditBreadcrumb = new Breadcrumb("Edit", RoutePaths.AppsEdit);

export default class BreadcrumbPaths {
    public static Dashboard() {
        return new BreadcrumbPath(new Array<Breadcrumb>(dashboardBreadcrumb));
    }

    public static Account() {
        return new BreadcrumbPath(new Array<Breadcrumb>(accountBreadcrumb));
    }

    public static GeoFenceMap() {
        return new BreadcrumbPath(new Array<Breadcrumb>(geoFenceMapBreadcrumb), true);
    }

    public static GeoFenceTable() {
        return new BreadcrumbPath(new Array<Breadcrumb>(geoFenceTableBreadcrumb), true);
    }

    public static Integrations() {
        return new BreadcrumbPath(new Array<Breadcrumb>(integrationsBreadcrumb), true);
    }

    public static IntegrationsEdit(integration?: IntegrationEnum) {
        const result = new BreadcrumbPath(new Array<Breadcrumb>(integrationsBreadcrumb, integrationsEditBreadcrumb), true);
        if (integration) {
            let integrationBreadcrumb = undefined;
            switch (integration) {
                case IntegrationEnum.API: {
                    integrationBreadcrumb = new Breadcrumb(titleCase(IntegrationEnum.API), RoutePaths.IntegrationsEditApi);
                    break;
                }
                case IntegrationEnum.PUSHER: {
                    integrationBreadcrumb = new Breadcrumb(titleCase(IntegrationEnum.PUSHER), RoutePaths.IntegrationsEditPusher);
                    break;
                }
                case IntegrationEnum.PUBNUB: {
                    integrationBreadcrumb = new Breadcrumb(titleCase(IntegrationEnum.PUBNUB), RoutePaths.IntegrationsEditPubnub);
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
                case IntegrationEnum.API: {
                    integrationBreadcrumb = new Breadcrumb(titleCase(IntegrationEnum.API), RoutePaths.IntegrationsNewApi);
                    break;
                }
                case IntegrationEnum.PUSHER: {
                    integrationBreadcrumb = new Breadcrumb(titleCase(IntegrationEnum.PUSHER), RoutePaths.IntegrationsNewPusher);
                    break;
                }
                case IntegrationEnum.PUBNUB: {
                    integrationBreadcrumb = new Breadcrumb(titleCase(IntegrationEnum.PUBNUB), RoutePaths.IntegrationsNewPubnub);
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

    public static Apps() {
        return new BreadcrumbPath(new Array<Breadcrumb>(appsBreadcrumb));
    }

    public static AppsNew() {
        return new BreadcrumbPath(new Array<Breadcrumb>(appsBreadcrumb, appsNewBreadcrumb));
    }

    public static AppsEdit() {
        return new BreadcrumbPath(new Array<Breadcrumb>(appsBreadcrumb, appsEditBreadcrumb));
    }

    public static AppsSelect() {
        return new BreadcrumbPath(new Array<Breadcrumb>(appsBreadcrumb));
    }

    public static GetAppBreadCrumb(appName: string) {
        if (!appName) {
            throw new Error("appName parameter is required");
        }
        return new Breadcrumb(appName, RoutePaths.AppsSelect);
    }
}
