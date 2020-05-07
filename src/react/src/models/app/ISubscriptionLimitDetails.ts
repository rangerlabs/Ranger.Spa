export default interface ISubscriptionLimitDetails {
    planId: string;
    utilized: ILimitDetails;
    limit: ILimitDetails;
    active: boolean;
    daysUntilCancellation: number;
}

export interface ILimitDetails {
    geofences: number;
    integrations: number;
    projects: number;
    accounts: number;
}
