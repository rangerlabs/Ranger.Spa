import IntegrationRequest from '../IntegrationRequest';
import { IntegrationEnum } from '../IntegrationEnum';

export default class WebhookIntegrationRequest implements IntegrationRequest {
    type: IntegrationEnum;
    constructor(public projectName: string, public name: string, public description: string, public url: string, public authKey: string) {
        this.type = IntegrationEnum.WEBHOOK;
    }
}
