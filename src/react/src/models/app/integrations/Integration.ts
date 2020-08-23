import { IntegrationEnum } from './IntegrationEnum';
import CorrelationModel from '../../CorrelationModel';
import { EnvironmentEnum } from '../../EnvironmentEnum';

export default interface Integration {
    readonly type: IntegrationEnum;
    correlationModel: CorrelationModel;
    enabled: boolean;
    isDefault: boolean;
    id: string;
    name: string;
    description: string;
    environment: EnvironmentEnum;
    version: number;
}
