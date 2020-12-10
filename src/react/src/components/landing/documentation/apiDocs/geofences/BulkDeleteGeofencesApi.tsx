import React from 'react';
import { Typography } from '@material-ui/core';
import HttpMethod from '../../textEnhancers/HttpMethod';
import EndpointHeaderBlock from '../../docComponents/EndpointHeaderBlock';
import EndpointPropertiesList, { EndpointProperty } from '../../docComponents/EndpointPropertyList';
import EndpointBody from '../../docComponents/EndpointBody';
import { EndpointBodyListItem } from '../../docComponents/EndpointBodyList';
import { UnorderedList } from '../../docComponents/UnorderedList';
import BulkDeleteGeofences from '../../json/geofences/BulkDeleteGeofences';
import SampleRequest from '../../docComponents/SampleRequest';
import JsonViewer from '../../docComponents/JsonViewer';

const parameters = [<EndpointBodyListItem name="externalIds" type="string[]" required description="The External Ids of the geofences to delete; [1, 500]" />];

const endpointProperties = [
    {
        title: 'Method',
        description: <HttpMethod method="POST" />,
    },
    {
        title: 'Authorization',
        description: 'Project API key',
    },
    {
        title: 'URI',
        description: 'https://rangerlabs.io/api/geofences/bulk-delete',
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

const BulkDeleteGeofencesApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Bulk deletes up to 500 Geofences at a time within the project.</Typography>
            </EndpointHeaderBlock>
            <EndpointBody>
                <EndpointPropertiesList properties={endpointProperties} />
                <SampleRequest>
                    <JsonViewer title="POST Geofence" json={BulkDeleteGeofences} expandLevel={3} />
                </SampleRequest>
            </EndpointBody>
        </React.Fragment>
    );
};

export default BulkDeleteGeofencesApi;
