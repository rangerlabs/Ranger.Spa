import RestUtilities, { IRestResponse } from './RestUtilities';
import { MergedIntegrationType } from '../models/app/integrations/MergedIntegrationTypes';
import { IntegrationEnum } from '../models/app/integrations/IntegrationEnum';
import WebhookIntegration from '../models/app/integrations/implementations/WebhookIntegration';

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
                        } as WebhookIntegration);
                        break;
                    }
                }
            });
            return result;
        });
    }

    async postWebhookIntegration(projectName: string, integration: WebhookIntegration): Promise<IRestResponse<void>> {
        return RestUtilities.post(`${projectName}/integrations/webhook`, integration);
    }
}
