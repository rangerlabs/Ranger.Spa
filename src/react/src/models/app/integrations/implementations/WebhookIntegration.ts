import Integration from '../Integration';
import { IntegrationEnum } from '../IntegrationEnum';
import KeyValuePair from '../../../KeyValuePair';
import CorrelationModel from '../../../CorrelationModel';

export default class WebhookIntegration implements Integration {
    constructor() {
        this.type = IntegrationEnum.WEBHOOK;
    }
    correlationModel: CorrelationModel;
    type: IntegrationEnum;
    id: string;
    projectName: string;
    name: string;
    description: string;
    url: string;
    headers: KeyValuePair[];
    metadata: KeyValuePair[];
}
