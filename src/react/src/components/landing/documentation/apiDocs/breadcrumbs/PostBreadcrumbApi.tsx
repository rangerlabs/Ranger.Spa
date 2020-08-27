import React from 'react';
import { Typography, Link } from '@material-ui/core';
import HttpMethod from '../../textEnhancers/HttpMethod';
import Code from '../../textEnhancers/Code';
import JsonViewer from '../../docComponents/JsonViewer';
import SampleRequest from '../../docComponents/SampleRequest';
import EndpointHeaderBlock from '../../docComponents/EndpointHeaderBlock';
import EndpointPropertiesList, { EndpointProperty } from '../../docComponents/EndpointPropertyList';
import PostBreadcrumb from '../../json/breadcrumbs/PostBreadcrumb';
import { UnorderedList } from '../../docComponents/UnorderedList';
import { EndpointBodyListItem } from '../../docComponents/EndpointBodyList';
import Bold from '../../textEnhancers/Bold';
import { scrollToLandingId } from '../../../../../helpers/Helpers';

const body = [
    <EndpointBodyListItem name="deviceId" type="string" required description="The unique device identifier" />,
    <EndpointBodyListItem name="externalUserId" type="string" description="The unique identifier for a logged in user" />,
    <EndpointBodyListItem
        name="coordinates"
        type={
            <Link variant="caption" component="button" onClick={() => scrollToLandingId('lnglat-section')}>
                LngLat
            </Link>
        }
        required
        description="The coordinates for a geofence - 1 center coordinate for shape: 'Circle',  [3, 512] for shape: 'Polygon' with implicit closure"
    />,
    <EndpointBodyListItem name="recordedAt" required type="datetime" description="The time the breadcrumb location was recorded at" />,
    <EndpointBodyListItem name="accuracy" type="number" description="The device's accuracy, ≥ 0" />,
    <EndpointBodyListItem
        name="metadata"
        type={
            <Link variant="caption" component="button" onClick={() => scrollToLandingId('key-value-pair-section')}>
                Key-Value Pair
            </Link>
        }
        description="An array of up to 16 metadata, duplicate keys permitted"
    />,
];

const endpointProperties = [
    {
        title: 'URI',
        description: 'https://rangerlabs.io/api/breadcrumbs',
    },
    {
        title: 'Method',
        description: <HttpMethod method="POST" />,
    },
    {
        title: 'Authoriztion',
        description: 'Test or Live API keys',
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

const PostBreadcrumbApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>
                    Creates a Breadcrumb which is used to track a device or user's movement through potential Geofences. The required <Code>deviceId</Code> is
                    the means of determining Geofence events and is supportive of anonymous users. The <Code>externalUserId</Code> can supplement{' '}
                    <Code>deviceId</Code> to uniquely identify users.
                </Typography>
            </EndpointHeaderBlock>
            <EndpointPropertiesList properties={endpointProperties} />
            <SampleRequest>
                <JsonViewer title="POST Breadcrumb" json={PostBreadcrumb} expandLevel={3} />
            </SampleRequest>
        </React.Fragment>
    );
};

export default PostBreadcrumbApi;
