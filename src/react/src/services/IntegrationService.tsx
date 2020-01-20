import RestUtilities, { IRestResponse } from './RestUtilities';
import { MergedIntegrationResponseType } from '../models/app/integrations/MergedIntegrationTypes';
import WebhookIntegrationResponse from '../models/app/integrations/implementations/WebhookIntegrationResponse';
import { IntegrationEnum } from '../models/app/integrations/IntegrationEnum';
import WebhookIntegrationRequest from '../models/app/integrations/implementations/WebhookIntegrationRequest';

export default class IntegrationService {
    async getIntegrations(projectName: string): Promise<Array<MergedIntegrationResponseType>> {
        return RestUtilities.get<MergedIntegrationResponseType[]>(`${projectName}/integrations`).then(integrationResponse => {
            const result = new Array<MergedIntegrationResponseType>();
            integrationResponse.content?.forEach(i => {
                switch (i.type) {
                    case IntegrationEnum.WEBHOOK: {
                        i = i as WebhookIntegrationResponse;
                        result.push(new WebhookIntegrationResponse(i.id, i.projectName, i.name, i.description, i.url, i.authKey));
                        break;
                    }
                }
            });
            return result;
        });
    }

    async getWebhookIntegration(projectName: string, name: string): Promise<WebhookIntegrationResponse> {
        let result = undefined as WebhookIntegrationResponse;
        RestUtilities.get<WebhookIntegrationResponse>(`${projectName}/integrations/webhook?name=${name}`).then(i => {
            result = i.content;
        });
        return result;
    }

    async postWebhookIntegration(projectName: string, integration: WebhookIntegrationRequest): Promise<IRestResponse<WebhookIntegrationResponse>> {
        return RestUtilities.post<WebhookIntegrationResponse>(`${projectName}/integrations/webhook`, integration);
    }
}
