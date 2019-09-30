import { IntegrationEnum } from './IntegrationEnum';

export default interface Integration {
    readonly type: IntegrationEnum;
    name: string;
    description: string;
}
