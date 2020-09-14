import React from 'react';
import { Typography, Link } from '@material-ui/core';
import HttpMethod from '../../textEnhancers/HttpMethod';
import EndpointHeaderBlock from '../../docComponents/EndpointHeaderBlock';
import EndpointPropertiesList, { EndpointProperty } from '../../docComponents/EndpointPropertyList';
import EndpointBody from '../../docComponents/EndpointBody';
import { EndpointBodyListItem } from '../../docComponents/EndpointBodyList';
import { UnorderedList } from '../../docComponents/UnorderedList';

const parameters = [<EndpointBodyListItem name="externalId" type="string" required description="The External Id of the geofence" />];

const endpointProperties = [
    {
        title: 'Method',
        description: <HttpMethod method="DELETE" />,
    },
    {
        title: 'Authorization',
        description: 'Project API key',
    },
    {
        title: 'URI',
        description: 'https://rangerlabs.io/api/geofences/{externalId}',
    },
    {
        title: 'API Version',
        description: '1.0',
    },
    {
        title: 'Parameters',
        description: <UnorderedList items={parameters} />,
    },
] as EndpointProperty[];

const DeleteGeofencesApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Deletes a geofence within the project.</Typography>
            </EndpointHeaderBlock>
            <EndpointBody>
                <EndpointPropertiesList properties={endpointProperties} />
            </EndpointBody>
        </React.Fragment>
    );
};

export default DeleteGeofencesApi;
