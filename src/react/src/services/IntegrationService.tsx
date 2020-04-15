import RestUtilities, { IRestResponse } from './RestUtilities';
import { MergedIntegrationType } from '../models/app/integrations/MergedIntegrationTypes';
import { IntegrationEnum } from '../models/app/integrations/IntegrationEnum';
import WebhookIntegration from '../models/app/integrations/implementations/WebhookIntegration';
import Integration from '../models/app/integrations/Integration';

export default class IntegrationService {
    async getIntegrations(projectName: string): Promise<Array<MergedIntegrationType>> {
        return RestUtilities.get<MergedIntegrationType[]>(`${projectName}/integrations`).then((integrationResponse) => {
            const result = new Array<MergedIntegrationType>();
            integrationResponse.result?.forEach((i) => {
                switch (i.type) {
                    case IntegrationEnum.WEBHOOK: {
                        i = i as WebhookIntegration;
                        result.push({
                            type: IntegrationEnum.WEBHOOK,
                            integrationId: i.integrationId,
                            enabled: i.enabled,
                            name: i.name,
                            description: i.description,
                            url: i.url,
                            headers: i.headers,
                            metadata: i.metadata,
                            environment: i.environment,
                            version: i.version,
                        } as WebhookIntegration);
                        break;
                    }
                }
            });
            return result;
        });
    }

    async postIntegration(projectName: string, integration: Integration): Promise<IRestResponse<void>> {
        switch (integration.type) {
            case IntegrationEnum.WEBHOOK: {
                return RestUtilities.post(`${projectName}/integrations/webhook`, integration);
            }
            default: {
                throw 'Invalid integration type';
            }
        }
    }

    async putIntegration(projectName: string, id: string, integration: Integration): Promise<IRestResponse<void>> {
        switch (integration.type) {
            case IntegrationEnum.WEBHOOK: {
                return RestUtilities.put(`${projectName}/integrations/webhook/${id}`, integration);
            }
            default: {
                throw 'Invalid integration type';
            }
        }
    }

    async deleteIntegration(projectName: string, name: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`${projectName}/integrations/${name}`);
    }
}
