import { IntegrationEnum } from "./IntegrationEnum";

export default interface Integration {
    readonly type: IntegrationEnum;
    appName: string;
    name: string;
    description: string;
}
