import RestUtilities, { IRestResponse } from './RestUtilities';
import { MergedIntegrationType } from '../models/app/integrations/MergedIntegrationTypes';
import { IntegrationEnum } from '../models/app/integrations/IntegrationEnum';
import WebhookIntegration from '../models/app/integrations/implementations/WebhookIntegration';
import Integration from '../models/app/integrations/Integration';
import PusherIntegration from '../models/app/integrations/implementations/PusherIntegration';

export default class IntegrationService {
    async getIntegrations(projectId: string): Promise<IRestResponse<Array<MergedIntegrationType>>> {
        return RestUtilities.get<MergedIntegrationType[]>(`${projectId}/integrations`).then((integrationResponse) => {
            const result = new Array<MergedIntegrationType>();
            integrationResponse.result?.forEach((i) => {
                switch (i.type) {
                    case IntegrationEnum.WEBHOOK: {
                        i = i as WebhookIntegration;
                        result.push({
                            type: IntegrationEnum.WEBHOOK,
                            id: i.id,
                            enabled: i.enabled,
                            name: i.name,
                            isDefault: i.isDefault,
                            description: i.description,
                            url: i.url,
                            signingKey: i.signingKey,
                            headers: i.headers,
                            metadata: i.metadata,
                            environment: i.environment,
                            version: i.version,
                        } as WebhookIntegration);
                        break;
                    }
                    case IntegrationEnum.PUSHER: {
                        i = i as PusherIntegration;
                        result.push({
                            type: IntegrationEnum.PUSHER,
                            id: i.id,
                            enabled: i.enabled,
                            name: i.name,
                            isDefault: i.isDefault,
                            description: i.description,
                            appId: i.appId,
                            key: i.key,
                            secret: i.secret,
                            cluster: i.cluster,
                            metadata: i.metadata,
                            environment: i.environment,
                            version: i.version,
                        } as PusherIntegration);
                        break;
                    }
                }
            });
            return Object.assign({}, integrationResponse, { result: result } as IRestResponse<Array<MergedIntegrationType>>) as IRestResponse<
                Array<MergedIntegrationType>
            >;
        });
    }

    async postIntegration(projectId: string, integration: Integration): Promise<IRestResponse<void>> {
        switch (integration.type) {
            case IntegrationEnum.WEBHOOK: {
                return RestUtilities.post(`${projectId}/integrations/webhook`, integration);
            }
            case IntegrationEnum.PUSHER: {
                return RestUtilities.post(`${projectId}/integrations/pusher`, integration);
            }
            default: {
                throw 'Invalid integration type';
            }
        }
    }

    async putIntegration(projectId: string, id: string, integration: Integration): Promise<IRestResponse<void>> {
        switch (integration.type) {
            case IntegrationEnum.WEBHOOK: {
                return RestUtilities.put(`${projectId}/integrations/webhook/${id}`, integration);
            }
            case IntegrationEnum.PUSHER: {
                return RestUtilities.put(`${projectId}/integrations/pusher/${id}`, integration);
            }
            default: {
                throw 'Invalid integration type';
            }
        }
    }

    async deleteIntegration(projectId: string, name: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`${projectId}/integrations/${name}`);
    }
}
