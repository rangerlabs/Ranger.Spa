import Integration from "../Integration";
import { IntegrationEnum } from "../IntegrationEnum";

export default class PusherIntegration implements Integration {
    type: IntegrationEnum;
    constructor(
        public appName: string,
        public name: string,
        public description: string,
        public appId: string,
        public key: string,
        public secret: string,
        public clusterName: string,
        public channelName: string,
        public eventName: string,
        public payload: string
    ) {
        this.type = IntegrationEnum.PUSHER;
    }
}
