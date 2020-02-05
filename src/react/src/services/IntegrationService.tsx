import RestUtilities, { IRestResponse } from './RestUtilities';
import { MergedIntegrationType } from '../models/app/integrations/MergedIntegrationTypes';
import { IntegrationEnum } from '../models/app/integrations/IntegrationEnum';
import WebhookIntegration from '../models/app/integrations/implementations/WebhookIntegration';
import Integration from '../models/app/integrations/Integration';

export default class IntegrationService {
    async getIntegrations(projectName: string): Promise<Array<MergedIntegrationType>> {
        return RestUtilities.get<MergedIntegrationType[]>(`${projectName}/integrations`).then(integrationResponse => {
            const result = new Array<MergedIntegrationType>();
            integrationResponse.content?.forEach(i => {
                switch (i.type) {
                    case IntegrationEnum.WEBHOOK: {
                        i = i as WebhookIntegration;
                        result.push({
                            type: IntegrationEnum.WEBHOOK,
                            id: i.id,
                            projectName: i.projectName,
                            name: i.name,
                            description: i.description,
                            url: i.url,
                            headers: i.headers,
                            metadata: i.metadata,
                            environment: i.environment,
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

    async putIntegration(projectName: string, name: string, integration: Integration): Promise<IRestResponse<void>> {
        switch (integration.type) {
            case IntegrationEnum.WEBHOOK: {
                return RestUtilities.put(`${projectName}/integrations/webhook/${name}`, integration);
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
