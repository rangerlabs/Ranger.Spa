export default class RoutePaths {
    public static Landing = "/";
    public static SignUp = "/signup";
    public static Callback = "/callback";
    public static Register = "/register";
    public static EnterDomain = "/enterdomain";
    public static Documentation = "/documentation";
    public static Pricing = "/pricing";
    public static Company = "/company";
    public static Login = "/login";
    public static Logout = "/logout";

    public static Home = "/home";
    public static Account = "/account";

    public static Users = "/users";
    public static UsersNew = "/users/new";
    public static UsersEdit = "/users/edit";

    public static Apps = "/apps";
    public static AppsSelect = "/apps/select";
    public static AppsNew = "/apps/new";
    public static AppsEdit = "/apps/edit";

    public static Integrations = "/:appName/integrations";
    public static IntegrationsNew = "/:appName/integrations/new";
    public static IntegrationsNewApi = "/:appName/integrations/new/api";
    public static IntegrationsEditApi = "/:appName/integrations/edit/api";
    public static IntegrationsNewPusher = "/:appName/integrations/new/pusher";
    public static IntegrationsEditPusher = "/:appName/integrations/edit/pusher";
    public static IntegrationsNewPubnub = "/:appName/integrations/new/pubnub";
    public static IntegrationsEditPubnub = "/:appName/integrations/edit/pubnub";

    public static GeoFenceMap = "/:appName/geofences/map";
    public static GeoFencesEdit = "/:appName/geofences/map/edit";
    public static GeoFenceTable = "/:appName/geofences/table";

    public static IsCurrentLocationWhiteListed = (): boolean => {
        let result = false;
        const path = window.location.pathname;
        if (
            path === RoutePaths.Landing ||
            path === RoutePaths.SignUp ||
            path === RoutePaths.Callback ||
            path === RoutePaths.Register ||
            path === RoutePaths.EnterDomain ||
            path === RoutePaths.Documentation ||
            path === RoutePaths.Pricing ||
            path === RoutePaths.Company ||
            path === RoutePaths.Login ||
            path === RoutePaths.Logout
        ) {
            result = true;
        }
        return result;
    };
}
