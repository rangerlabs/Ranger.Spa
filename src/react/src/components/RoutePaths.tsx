export default class RoutePaths {
    public static Landing = '/';
    public static SignUp = '/signup';
    public static Callback = '/callback';
    public static Register = '/register';
    public static EnterDomain = '/enter-domain';
    public static Docs = '/docs';
    public static Pricing = '/pricing';
    public static Company = '/company';
    public static Login = '/login';
    public static Logout = '/logout';
    public static ConfirmDomain = '/confirm-domain';
    public static ConfirmUser = '/confirm-user';
    public static PasswordReset = '/password-reset';
    public static EmailChange = '/email-change';
    public static TransferPrimaryOwnership = '/transfer-ownership';
    public static CancelTransferPrimaryOwnership = '/cancel-ownership-transfer';

    public static Dashboard = '/dashboard';
    public static Account = '/account';
    public static Organization = '/organization';
    public static Subscription = '/subscription';

    public static Users = '/users';
    public static UsersNew = '/users/new';
    public static UsersEdit = '/users/edit';

    public static Projects = '/projects';
    public static FirstProjectRequired = '/first-project';
    public static ProjectsSelect = '/projects/select';
    public static ProjectsNew = '/projects/new';
    public static ProjectsEdit = '/projects/edit';

    public static Integrations = '/:appName/integrations';
    public static IntegrationsNew = '/:appName/integrations/new';
    public static IntegrationsNewWebhook = '/:appName/integrations/new/webhook';
    public static IntegrationsEditWebhook = '/:appName/integrations/edit/webhook';

    public static GeofenceMap = '/:appName/geofences/map';
    public static GeofencesEdit = '/:appName/geofences/map/edit';
    public static GeofenceTable = '/:appName/geofences/table';

    public static IsCurrentLocationWhiteListed = (): boolean => {
        let result = false;
        const path = window.location.pathname;
        if (
            path === RoutePaths.Landing ||
            path === RoutePaths.SignUp ||
            path === RoutePaths.Callback ||
            path === RoutePaths.Register ||
            path === RoutePaths.EnterDomain ||
            path === RoutePaths.Docs ||
            path === RoutePaths.Pricing ||
            path === RoutePaths.Company ||
            path === RoutePaths.Login ||
            path === RoutePaths.Logout ||
            path === RoutePaths.ConfirmDomain ||
            path === RoutePaths.ConfirmUser ||
            path === RoutePaths.PasswordReset ||
            path === RoutePaths.EmailChange ||
            path === RoutePaths.TransferPrimaryOwnership ||
            path === RoutePaths.CancelTransferPrimaryOwnership
        ) {
            result = true;
        }
        return result;
    };
}
