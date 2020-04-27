export default interface ISubscriptionLimitDetails {
    planId: string;
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
