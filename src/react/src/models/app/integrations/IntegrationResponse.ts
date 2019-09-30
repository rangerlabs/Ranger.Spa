import { IntegrationEnum } from './IntegrationEnum';

export default interface Integration {
    readonly type: IntegrationEnum;
    projectName: string;
    name: string;
    description: string;
}
