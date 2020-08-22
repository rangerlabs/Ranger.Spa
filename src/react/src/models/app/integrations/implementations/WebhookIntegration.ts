import Integration from '../Integration';
import { IntegrationEnum } from '../IntegrationEnum';
import KeyValuePair from '../../../KeyValuePair';
import CorrelationModel from '../../../CorrelationModel';
import { EnvironmentEnum } from '../../../EnvironmentEnum';

export default class WebhookIntegration implements Integration {
    constructor() {
        this.type = IntegrationEnum.WEBHOOK;
    }
    correlationModel: CorrelationModel;
    type: IntegrationEnum;
    enabled: boolean;
    id: string;
    name: string;
    description: string;
    url: string;
    signingKey: string;
    headers: KeyValuePair[];
    metadata: KeyValuePair[];
    environment: EnvironmentEnum;
    version: number;
}
