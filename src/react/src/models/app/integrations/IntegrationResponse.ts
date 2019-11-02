import { IntegrationEnum } from './IntegrationEnum';

export default interface IntegrationResponse {
    readonly type: IntegrationEnum;
    id: string;
    projectName: string;
    name: string;
    description: string;
}
