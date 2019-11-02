import { MergedIntegrationResponseType } from '../models/app/integrations/MergedIntegrationTypes';

export function getSubDomain(): string {
    let domain = '';
    if (window && window.location) {
        const host = window.location.host;
        if (host.split('.').length >= 3) {
            domain = host.split('.')[0];
        }
    }
    return domain;
}

export function getIntegrationsFromIntegrationIds(integrationIds: string[], integrations: MergedIntegrationResponseType[]) {
    const integrationArray = [] as MergedIntegrationResponseType[];
    integrationIds.map(id => {
        const integration = integrations.find(i => i.id === id);
        if (integration) {
            integrationArray.push(integration);
        }
    });
    return integrationArray;
}
