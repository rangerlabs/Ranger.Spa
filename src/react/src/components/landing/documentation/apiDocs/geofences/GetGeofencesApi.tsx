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
        title: 'Authoriztion',
        description: 'Project API key',
    },
    {
        title: 'URI',
        description: 'https://rangerlabs.io/api/geofences',
    },
    {
        title: 'API Version',
        description: '1.0',
    },
] as EndpointProperty[];

const GetGeofencesApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Retrieves geofences for the project.</Typography>
            </EndpointHeaderBlock>
            <EndpointBody>
                <EndpointPropertiesList properties={endpointProperties} />
            </EndpointBody>
        </React.Fragment>
    );
};

export default GetGeofencesApi;
