export default class RoutePaths {
    public static Landing = '/';
    public static SignUp = '/signup';
    public static Callback = '/callback';
    public static Register = '/register';
    public static EnterDomain = '/enterdomain';
    public static Documentation = '/documentation';
    public static Pricing = '/pricing';
    public static Company = '/company';
    public static Login = '/login';
    public static Logout = '/logout';
    public static ConfirmDomain = '/confirmdomain';

    public static Dashboard = '/dashboard';
    public static Account = '/account';

    public static Users = '/users';
    public static UsersNew = '/users/new';
    public static UsersEdit = '/users/edit';

    public static Projects = '/projects';
    public static ProjectsSelect = '/projects/select';
    public static ProjectsNew = '/projects/new';
    public static ProjectsEdit = '/projects/edit';

    public static Integrations = '/:appName/integrations';
    public static IntegrationsNew = '/:appName/integrations/new';
    public static IntegrationsNewWebhook = '/:appName/integrations/new/webhook';
    public static IntegrationsEditWebhook = '/:appName/integrations/edit/webhook';

    public static GeoFenceMap = '/:appName/geofences/map';
    public static GeoFencesEdit = '/:appName/geofences/map/edit';
    public static GeoFenceTable = '/:appName/geofences/table';

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
