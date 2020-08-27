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

const lngLat = [
    <EndpointBodyListItem name="lng" type="number" required description="Coordinate longitude, [-180, 180]" />,
    <EndpointBodyListItem name="lat" type="number" required description="Coordinate latitude, [-90, 90]" />,
];

const metadata = [
    <EndpointBodyListItem name="key" type="string" required description="Metadata key" />,
    <EndpointBodyListItem name="value" type="string" required description="Metadata value" />,
];

const dailySchedule = [
    <EndpointBodyListItem name="startTime" type="string" required description="The time when this geofence may begin executing integrations - HH:mm:ss" />,
    <EndpointBodyListItem name="endTime" type="string" required description="The time when this geofence must stop executing integrations - HH:mm:ss" />,
];

const schedule = [
    <EndpointBodyListItem
        name="timeZoneId"
        type="string"
        required
        description="IANA Time Zone Name that the Breadcrumb.RecordedAt property should be converted to and evaluated against"
    />,
    <EndpointBodyListItem name="sunday" type="object" required description="The Sunday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="monday" type="object" required description="The Monday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="tuesday" type="object" required description="The Tuesday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="wednesday" type="object" required description="The Wednesday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="thursday" type="object" required description="The Thursday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="friday" type="object" required description="The Friday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="saturday" type="object" required description="The Saturday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
];

const body = [
    <EndpointBodyListItem name="shape" type="string" required description="The shape of the geofence - 'Circle' or 'Polygon'" />,
    <EndpointBodyListItem name="externalId" type="string" required description="The unique identifier for the geofence - lowercase alphanumeric and dashes" />,
    <EndpointBodyListItem name="description" type="string" description="An optional description for the geofence" />,
    <EndpointBodyListItem name="onEnter" type="boolean" description="Whether integrations should execute when devices enter - defaults to 'true'" />,
    <EndpointBodyListItem name="onDwell" type="boolean" description="Whether integrations should execute when devices are dwelling - defaults to 'false'" />,
    <EndpointBodyListItem name="onExit" type="boolean" description="Whether integrations should execute when devices exit - defaults to 'true'" />,
    <EndpointBodyListItem name="enabled" type="boolean" description="Whether any integrations should execute for selected events - defaults to 'true'" />,
    <EndpointBodyListItem name="integrationIds" type="string[]" description="An array of the non-default integrations this geofence should execute" />,
    <EndpointBodyListItem
        name="coordinates"
        type="object[]"
        required
        description="The coordinates for a geofence - 1 center coordinate for shape: 'Circle',  [3, 512] for shape: 'Polygon' with implicit closure"
        item={<UnorderedList items={lngLat} />}
    />,
    <EndpointBodyListItem name="radius" type="number" description="The radius of a circular geofence - required when shape: 'Circle', ≥ 50" />,
    <EndpointBodyListItem
        name="schedule"
        type="object"
        description="The weekly schedule for when this geofence may execute integrations, exclude the execute integrations at all times"
        item={<UnorderedList items={schedule} />}
    />,
    <EndpointBodyListItem
        name="metadata"
        type="object[]"
        description="An array of up to 16 metadata, duplicate keys permitted"
        item={<UnorderedList items={metadata} />}
    />,
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
            <EndpointPropertiesList properties={endpointProperties} />
            <SampleRequest>
                <JsonViewer title="POST Breadcrumb" json={PostGeofence} expandLevel={3} />
            </SampleRequest>
        </React.Fragment>
    );
};

export default PostGeofencesApi;
