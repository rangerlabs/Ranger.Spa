import React from 'react';
import { Typography } from '@material-ui/core';
import HttpMethod from '../../textEnhancers/HttpMethod';
import EndpointHeaderBlock from '../../docComponents/EndpointHeaderBlock';
import EndpointPropertiesList, { EndpointProperty } from '../../docComponents/EndpointPropertyList';
import { EndpointBodyListItem } from '../../docComponents/EndpointBodyList';
import { UnorderedList } from '../../docComponents/UnorderedList';
import SampleRequest from '../../docComponents/SampleRequest';
import JsonViewer from '../../docComponents/JsonViewer';
import PostGeofence from '../../json/geofences/PostGeofence';
import { ScheduleEndpointBodyListItem } from '../commonTypes/ScheduleType';
import { KeyValuePairEndpointBodyListItem } from '../commonTypes/KeyValuePairType';
import { LngLatEndpointBodyListItem } from '../commonTypes/LngLatType';
import EndpointBody from '../../docComponents/EndpointBody';

const body = [
    <EndpointBodyListItem name="shape" type="string" required description="The shape of the geofence - 'Circle' or 'Polygon'" />,
    <EndpointBodyListItem name="externalId" type="string" required description="The unique identifier for the geofence - lowercase alphanumeric and dashes" />,
    <EndpointBodyListItem name="description" type="string" description="An optional description for the geofence" />,
    <EndpointBodyListItem name="onEnter" type="boolean" description="Whether integrations should execute when devices enter - defaults to 'true'" />,
    <EndpointBodyListItem name="onDwell" type="boolean" description="Whether integrations should execute when devices are dwelling - defaults to 'false'" />,
    <EndpointBodyListItem name="onExit" type="boolean" description="Whether integrations should execute when devices exit - defaults to 'true'" />,
    <EndpointBodyListItem name="enabled" type="boolean" description="Whether any integrations should execute for selected events - defaults to 'true'" />,
    <EndpointBodyListItem name="integrationIds" type="string[]" description="An array of the non-default integrations this geofence should execute" />,
    <LngLatEndpointBodyListItem
        isArray
        name="coordinates"
        description="The coordinates for a geofence - 1 center coordinate for shape: 'Circle',  [3, 512] for shape: 'Polygon' with implicit closure"
    />,
    <EndpointBodyListItem name="radius" type="number" description="The radius of a circular geofence in meters - defaults to 100, ≥ 50" />,
    <ScheduleEndpointBodyListItem />,
    <KeyValuePairEndpointBodyListItem isArray name="metadata" description="An array of up to 16 metadata, duplicate keys permitted" />,
];

const endpointProperties = [
    {
        title: 'URI',
        description: 'https://rangerlabs.io/api/geofences',
    },
    {
        title: 'Method',
        description: <HttpMethod method="POST" />,
    },
    {
        title: 'Authoriztion',
        description: 'Project API key',
    },
    {
        title: 'API Version',
        description: '1.0',
    },
    {
        title: 'Body',
        description: <UnorderedList items={body} />,
    },
] as EndpointProperty[];

const PostGeofencesApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Creates a geofences within the project.</Typography>
            </EndpointHeaderBlock>
            <EndpointBody>
                <EndpointPropertiesList properties={endpointProperties} />
                <SampleRequest>
                    <JsonViewer title="POST Breadcrumb" json={PostGeofence} expandLevel={3} />
                </SampleRequest>
            </EndpointBody>
        </React.Fragment>
    );
};

export default PostGeofencesApi;
