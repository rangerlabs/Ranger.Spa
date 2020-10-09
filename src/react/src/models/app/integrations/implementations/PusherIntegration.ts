import Integration from '../Integration';
import { IntegrationEnum } from '../IntegrationEnum';
import KeyValuePair from '../../../KeyValuePair';
import CorrelationModel from '../../../CorrelationModel';
import { EnvironmentEnum } from '../../../EnvironmentEnum';

export default class PusherIntegration implements Integration {
    constructor() {
        this.type = IntegrationEnum.PUSHER;
    }
    correlationModel: CorrelationModel;
    type: IntegrationEnum;
    enabled: boolean;
    isDefault: boolean;
    id: string;
    name: string;
    description: string;
    appId: string;
    key: string;
    secret: string;
    cluster: string;
    metadata: KeyValuePair[];
    environment: EnvironmentEnum;
    version: number;
}
