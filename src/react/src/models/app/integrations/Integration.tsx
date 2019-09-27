import { IntegrationEnum } from './IntegrationEnum';

export default interface Integration {
    readonly type: IntegrationEnum;
    appId: string;
    name: string;
    description: string;
}
