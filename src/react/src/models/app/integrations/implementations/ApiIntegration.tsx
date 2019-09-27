import Integration from '../Integration';
import { IntegrationEnum } from '../IntegrationEnum';

export default class ApiIntegration implements Integration {
    type: IntegrationEnum;
    constructor(public appId: string, public name: string, public description: string, public httpEndpoint: string, public authKey: string) {
        this.type = IntegrationEnum.API;
    }
}
