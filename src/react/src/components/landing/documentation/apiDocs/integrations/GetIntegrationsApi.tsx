import React from 'react';
import { Typography } from '@material-ui/core';
import HttpMethod from '../../textEnhancers/HttpMethod';
import EndpointHeaderBlock from '../../docComponents/EndpointHeaderBlock';
import EndpointPropertiesList, { EndpointProperty } from '../../docComponents/EndpointPropertyList';
import EndpointBody from '../../docComponents/EndpointBody';

const endpointProperties = [
    {
        title: 'Method',
        description: <HttpMethod method="GET" />,
    },
    {
        title: 'Authorization',
        description: 'Project API key',
    },
    {
        title: 'URI',
        description: 'https://rangerlabs.io/api/integrations',
    },
    {
        title: 'API Version',
        description: '1.0',
    },
    {
        title: 'Rate Limits',
        description: '10 requests per second',
    },
] as EndpointProperty[];

const GetIntegrationsApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Retrieves Integrations within the project.</Typography>
            </EndpointHeaderBlock>
            <EndpointBody>
                <EndpointPropertiesList properties={endpointProperties} />
            </EndpointBody>
        </React.Fragment>
    );
};

export default GetIntegrationsApi;
