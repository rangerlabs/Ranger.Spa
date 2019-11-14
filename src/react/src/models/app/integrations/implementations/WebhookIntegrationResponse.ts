import IntegrationResponse from '../IntegrationResponse';
import { IntegrationEnum } from '../IntegrationEnum';

export default class WebhookIntegrationResponse implements IntegrationResponse {
    type: IntegrationEnum;
    constructor(public id: string, public projectName: string, public name: string, public description: string, public url: string, public authKey: string) {
        this.type = IntegrationEnum.WEBHOOK;
    }
}
