import Users from "./app/users/Users";
import UserForm from "./app/users/UserForm";
import Apps from "./app/apps/Apps";
import RoutePaths from "./RoutePaths";
import IAppRoute from "./IAppRoute";
import AppForm from "./app/apps/AppForm";
import GeoFences from "./app/geofences/GeoFences";
import GeoFenceForm from "./app/geofences/googleMap/GeoFenceForm";
import Integrations from "./app/integrations/Integrations";
import IntegrationsNew from "./app/integrations/form/IntegrationsNew";
import IntegrationsNewApi from "./app/integrations/form/ApiIntegrationForm";
import IntegrationsNewPusher from "./app/integrations/form/PusherIntegrationForm";
import AppsSelect from "./app/apps/AppsSelect";
import Home from "./app/home/Home";
import BreadcrumbPaths from "./BreadcrumbPaths";
import { IntegrationEnum } from "../models/app/integrations/IntegrationEnum";
import Account from "./app/account/Account";

export const AuthorizedComponents: IAppRoute[] = [
    { exact: true, path: RoutePaths.Home, component: Home, breadcrumbPath: BreadcrumbPaths.Home() },
    { exact: true, path: RoutePaths.Account, component: Account, breadcrumbPath: BreadcrumbPaths.Account() },

    { exact: true, path: RoutePaths.Users, component: Users, breadcrumbPath: BreadcrumbPaths.Users() },
    { exact: true, path: RoutePaths.UsersNew, component: UserForm, breadcrumbPath: BreadcrumbPaths.UsersNew() },
    { exact: true, path: RoutePaths.UsersEdit, component: UserForm, breadcrumbPath: BreadcrumbPaths.UsersEdit() },

    { exact: true, path: RoutePaths.Apps, component: Apps, breadcrumbPath: BreadcrumbPaths.Apps() },
    { exact: true, path: RoutePaths.AppsSelect, component: AppsSelect, breadcrumbPath: BreadcrumbPaths.AppsSelect() },
    { exact: true, path: RoutePaths.AppsNew, component: AppForm, breadcrumbPath: BreadcrumbPaths.AppsNew() },
    { exact: false, path: RoutePaths.AppsEdit, component: AppForm, breadcrumbPath: BreadcrumbPaths.AppsEdit() },

    { exact: true, path: [RoutePaths.GeoFenceMap, RoutePaths.GeoFencesEdit], component: GeoFenceForm, breadcrumbPath: BreadcrumbPaths.GeoFenceMap() },
    { exact: true, path: RoutePaths.GeoFenceTable, component: GeoFences, breadcrumbPath: BreadcrumbPaths.GeoFenceTable() },

    { exact: true, path: RoutePaths.Integrations, component: Integrations, breadcrumbPath: BreadcrumbPaths.Integrations() },
    { exact: true, path: RoutePaths.IntegrationsNew, component: IntegrationsNew, breadcrumbPath: BreadcrumbPaths.IntegrationsNew() },
    { exact: true, path: RoutePaths.IntegrationsEditApi, component: IntegrationsNewApi, breadcrumbPath: BreadcrumbPaths.IntegrationsEdit(IntegrationEnum.API) },
    { exact: true, path: RoutePaths.IntegrationsNewApi, component: IntegrationsNewApi, breadcrumbPath: BreadcrumbPaths.IntegrationsNew(IntegrationEnum.API) },
    {
        exact: true,
        path: RoutePaths.IntegrationsEditPusher,
        component: IntegrationsNewPusher,
        breadcrumbPath: BreadcrumbPaths.IntegrationsEdit(IntegrationEnum.API),
    },
    {
        exact: true,
        path: RoutePaths.IntegrationsNewPusher,
        component: IntegrationsNewPusher,
        breadcrumbPath: BreadcrumbPaths.IntegrationsNew(IntegrationEnum.PUSHER),
    },

    // {
    //     exact: true,
    //     path: RoutePaths.IntegrationsNewPubnub,
    //     component: IntegrationsSelect,
    //     breadcrumbPath: BreadcrumbPaths.IntegrationsNew(IntegrationEnum.PUBNUB),
    // },
];
