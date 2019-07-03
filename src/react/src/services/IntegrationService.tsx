import RestUtilities, { IRestResponse } from "./RestUtilities";
import { MergedIntegrationType } from "../models/app/integrations/MergedIntegrationType";
import ApiIntegration from "../models/app/integrations/implementations/ApiIntegration";
import PusherIntegration from "../models/app/integrations/implementations/PusherIntegration";
import Logger from "./Logger/Logger";
import { IntegrationEnum } from "../models/app/integrations/IntegrationEnum";

export default class IntegrationService {
    async getIntegrations(): Promise<Array<MergedIntegrationType>> {
        const result = new Array<MergedIntegrationType>();
        RestUtilities.get<MergedIntegrationType[]>("/app/integration/all").then(integrationResponse => {
            integrationResponse.content.forEach(i => {
                switch (i.type) {
                    case IntegrationEnum.API: {
                        i = i as ApiIntegration;
                        result.push(new ApiIntegration(i.appName, i.name, i.description, i.httpEndpoint, i.authKey));
                        break;
                    }
                    case i.type: {
                        i = i as PusherIntegration;
                        result.push(
                            new PusherIntegration(
                                i.appName,
                                i.name,
                                i.description,
                                i.appId,
                                i.key,
                                i.secret,
                                i.clusterName,
                                i.channelName,
                                i.eventName,
                                i.payload
                            )
                        );
                        break;
                    }
                }
            });
        });
        return result;
    }

    async getApiIntegration(name: string): Promise<ApiIntegration> {
        let result = undefined as ApiIntegration;
        RestUtilities.get<ApiIntegration>("/app/integration/api?name=" + name).then(i => {
            result = i.content;
        });
        return result;
    }

    async getPusherIntegration(name: string): Promise<PusherIntegration> {
        let result = undefined as PusherIntegration;
        RestUtilities.get<PusherIntegration>("/app/integration/pusher?name=" + name).then(i => {
            result = i.content;
        });
        return result;
    }

    async postApiIntegration(integration: ApiIntegration): Promise<IRestResponse<ApiIntegration>> {
        return RestUtilities.post<ApiIntegration>("/app/integration/api", integration);
    }

    async postPusherIntegration(integration: PusherIntegration): Promise<IRestResponse<PusherIntegration>> {
        return RestUtilities.post<PusherIntegration>("/app/integration/pusher", integration);
    }
}
