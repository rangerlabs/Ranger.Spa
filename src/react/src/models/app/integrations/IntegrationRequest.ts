import { IntegrationEnum } from './IntegrationEnum';

export default interface IntegrationRequest {
    readonly type: IntegrationEnum;
    name: string;
    description: string;
}
