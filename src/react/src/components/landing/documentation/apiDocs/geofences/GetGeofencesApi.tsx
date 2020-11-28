import React from 'react';
import { Typography } from '@material-ui/core';
import HttpMethod from '../../textEnhancers/HttpMethod';
import EndpointHeaderBlock from '../../docComponents/EndpointHeaderBlock';
import EndpointPropertiesList, { EndpointProperty } from '../../docComponents/EndpointPropertyList';
import EndpointBody from '../../docComponents/EndpointBody';
import { EndpointBodyListItem } from '../../docComponents/EndpointBodyList';
import { UnorderedList } from '../../docComponents/UnorderedList';

const queryParams = [
    <EndpointBodyListItem name="externalId" type="string" description="Retrieve a specific geofence by its External Id" />,
    <EndpointBodyListItem name="search" type="string" required description="Find Geofences whose External Id begins with the provide string" />,
    <EndpointBodyListItem
        name="orderBy"
        type="string"
        description="Order paginated Geofences by one of 'ExternalId', 'Shape', 'Enabled', 'CreatedDate', or 'UpdatedDate'"
    />,
    <EndpointBodyListItem name="sortOrder" type="string" required description="Sort paginated Geofences by one of 'asc' or 'desc'" />,
    <EndpointBodyListItem name="pageCount" type="number" description="The number of Geofences per page, [1,1000]" />,
    <EndpointBodyListItem name="page" type="number" description="The page to retrieve Geofences for" />,
];
const responseHeaders = [
    <EndpointBodyListItem name="X-Pagination-TotalCount" type="number" description="The total number of Geofences within the project" />,
    <EndpointBodyListItem name="X-Pagination-OrderBy" type="string" required description="The requested field to order by" />,
    <EndpointBodyListItem name="X-Pagination-SortOrder" type="number" description="The requested number of Geofences per page" />,
    <EndpointBodyListItem name="X-Pagination-PageCount" type="number" description="The requested number of Geofences per page" />,
    <EndpointBodyListItem name="X-Pagination-Page" type="number" required description="The requested page" />,
];

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
        description: 'https://rangerlabs.io/api/geofences',
    },
    {
        title: 'API Version',
        description: '1.0',
    },
    {
        title: 'Query Parameters',
        description: <UnorderedList items={queryParams} />,
    },
    {
        title: 'Response Headers',
        description: <UnorderedList items={responseHeaders} />,
    },
] as EndpointProperty[];

const GetGeofencesApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Retrieves paginated geofences within the project.</Typography>
            </EndpointHeaderBlock>
            <EndpointBody>
                <EndpointPropertiesList properties={endpointProperties} />
            </EndpointBody>
        </React.Fragment>
    );
};

export default GetGeofencesApi;
