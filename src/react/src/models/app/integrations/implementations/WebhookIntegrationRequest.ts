import IntegrationRequest from '../IntegrationRequest';
import { IntegrationEnum } from '../IntegrationEnum';
import KeyValuePair from '../../../KeyValuePair';

export default class WebhookIntegrationRequest implements IntegrationRequest {
    type: IntegrationEnum;
    constructor(
        public projectName: string,
        public name: string,
        public description: string,
        public url: string,
        public headers: KeyValuePair[],
        public metadata: KeyValuePair[]
    ) {
        this.type = IntegrationEnum.WEBHOOK;
    }
}
