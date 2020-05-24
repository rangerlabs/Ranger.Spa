import { ILimitDetails } from './ILimitDetails';

export default interface ISubscriptionLimitDetails {
    planId: string;
    utilized: ILimitDetails;
    limit: ILimitDetails;
    active: boolean;
    daysUntilCancellation: number;
}
