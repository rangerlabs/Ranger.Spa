import { StatusEnum } from './StatusEnum';

export default interface CorrelationModel {
    correlationId: string;
    status: StatusEnum;
    resourceId?: string;
}
