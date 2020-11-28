import React from 'react';
import { Typography } from '@material-ui/core';
import HttpMethod from '../../textEnhancers/HttpMethod';
import EndpointHeaderBlock from '../../docComponents/EndpointHeaderBlock';
import EndpointPropertiesList, { EndpointProperty } from '../../docComponents/EndpointPropertyList';
import EndpointBody from '../../docComponents/EndpointBody';
import { EndpointBodyListItem } from '../../docComponents/EndpointBodyList';
import { UnorderedList } from '../../docComponents/UnorderedList';

const queryParams = [
    <EndpointBodyListItem name="externalId" type="string" description="Retrieve a specific Geofence by its External Id" />,
    <EndpointBodyListItem name="search" type="string" description="Find Geofences whose External Id begins with the provide string" />,
    <EndpointBodyListItem
        name="orderBy"
        type="string"
        description="Order the paginated Geofences by the provided field - defaults to 'CreatedDate'; 'ExternalId', 'Shape', 'Enabled', 'CreatedDate', or 'UpdatedDate'"
    />,
    <EndpointBodyListItem name="sortOrder" type="string" description="Sort order of the paginated Geofences - defaults to 'desc'; 'asc' or 'desc'" />,
    <EndpointBodyListItem name="pageCount" type="number" description="The number of Geofences per page - defaults to 100; [1,1000]" />,
    <EndpointBodyListItem name="page" type="number" description="The page to retrieve Geofences for - defaults to 0" />,
];
const responseHeaders = [
    <EndpointBodyListItem name="X-Pagination-TotalCount" type="number" description="The total number of Geofences within the project" />,
    <EndpointBodyListItem name="X-Pagination-OrderBy" type="string" description="The requested field to order by" />,
    <EndpointBodyListItem name="X-Pagination-SortOrder" type="number" description="The requested sort order" />,
    <EndpointBodyListItem name="X-Pagination-PageCount" type="number" description="The requested number of Geofences per page" />,
    <EndpointBodyListItem name="X-Pagination-Page" type="number" description="The requested page" />,
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
