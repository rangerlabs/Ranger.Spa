export default interface ISubscriptionLimitDetails {
    utilized: {
        geofences: number;
        integrations: number;
        projects: number;
        accounts: number;
    };
    limit: {
        geofences: number;
        integrations: number;
        projects: number;
        accounts: number;
    };
}
