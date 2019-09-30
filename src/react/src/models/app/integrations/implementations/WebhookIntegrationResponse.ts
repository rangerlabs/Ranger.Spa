import Integration from '../IntegrationResponse';
import { IntegrationEnum } from '../IntegrationEnum';

export default class WebhookIntegrationResponse implements Integration {
    type: IntegrationEnum;
    constructor(public projectName: string, public name: string, public description: string, public url: string, public authKey: string) {
        this.type = IntegrationEnum.WEBHOOK;
    }
}
