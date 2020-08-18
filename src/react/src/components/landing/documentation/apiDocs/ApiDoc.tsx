import { OutlineElement } from '../docComponents/OutlineElement';
import React from 'react';
import Introduction from '../docComponents/Introduction';
import Paragraph from '../docComponents/Paragraph';
import Outline from '../docComponents/Outline';
import Section from '../docComponents/Section';
import { Link } from '@material-ui/core';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import RoutePaths from '../../../RoutePaths';
import DescriptiveList, { Description } from '../docComponents/DescriptiveList';
import Bold from '../textEnhancers/Bold';
import HttpMethod from '../textEnhancers/HttpMethod';
import Code from '../textEnhancers/Code';
import { BulletedUnorderedList } from '../docComponents/UnorderedList';
import JsonViewer from '../docComponents/JsonViewer';
import SuccessfulResponseBody from '../json/SuccessfulResponseBody';
import UnsuccessfulResponseBody from '../json/UnsuccessfulResponseBody';
import Block from '../docComponents/Block';
import SubSection from '../docComponents/SubSection';
import SampleRequest from '../docComponents/SampleRequest';
import PostBreadcrumb from '../json/breadcrumbs/PostBreadcrumb';
import DocRoutePaths from '../DocRoutePaths';

export const ApiDocOutline = [
    {
        name: 'API Reference',
        id: 'api-section',
    },
    {
        name: 'API Keys',
        id: 'api-keys-section',
    },
    {
        name: 'Versioning',
        id: 'versioning-section',
    },
    {
        name: 'Responses',
        id: 'responses-section',
    },
    {
        name: 'Breadcrumbs',
        id: 'breadcrumbs-section',
        subElements: [
            {
                name: 'POST',
                id: 'post-breadcrumbs-section',
            },
        ],
    },
    {
        name: 'Geofences',
        id: 'geofences-section',
        subElements: [
            {
                name: 'GET',
                id: 'get-geofences-section',
            },
            {
                name: 'POST',
                id: 'post-geofences-section',
            },
            {
                name: 'PUT',
                id: 'put-geofences-section',
            },
            {
                name: 'DELETE',
                id: 'delete-geofences-section',
            },
        ],
    },
    {
        name: 'Integrations',
        id: 'integrations-section',
        subElements: [
            {
                name: 'GET',
                id: 'get-integrations-section',
            },
        ],
    },
] as OutlineElement[];

interface ApiDocsProps extends IDocProps {
    push: typeof push;
}

const apiKeyDescriptions = [
    {
        title: 'Live API key',
        description:
            'The Live API key is intended to be deployed into a production environment for submitting Breadcrumbs. This key will execute Integrations whose environent is set to LIVE.',
    },
    {
        title: 'Test API key',
        description:
            'The Test API key is intended to be deployed to any non-production environment for submitting Breadcrumbs. This key will execute Integrations whose environent is set to TEST.',
    },
    {
        title: 'Project API key',
        description:
            'The Project API key provides the ability to programatically manage a subset of resources within a Project. For example, this key can be used for CRUD operations on Geofence resources.',
    },
] as Description[];

const responseCodes = [
    '200: Success',
    '202: Accepted',
    '400: Bad request ',
    '401: Unauthorized',
    '402: Payment required',
    '403: Forbidden',
    '404: Not found',
    '409: Conflict',
    '429: Too many requests',
    '451: Unavailable for legal reasons',
    '500: Internal server error',
    '503: Service temporarily unavailable',
];

const ApiDoc = function (props: ApiDocsProps) {
    return (
        <React.Fragment>
            <Introduction id="api-section" text="Api Reference">
                <Paragraph>This section documents the available REST endpoints that clients may access via the API Keys provided for each Project.</Paragraph>
                <Paragraph>
                    Ranger's API is a RESTful JSON API which is backed by an Event Driven Architecture. Consequently, many of Ranger's endpoints return{' '}
                    <Code>202 Accepted</Code> status codes. Clients which receive <Code>202 Accepted</Code> responses should anticipate the need to query for
                    the result of their operation. Future API enhancments will provide clients a unique URI to query for the status and result of their
                    operation.
                </Paragraph>
                <Paragraph>
                    For <HttpMethod method="POST" /> or <HttpMethod method="PUT" /> endpoints, Ranger accepts <Code>Content-Type: application/json</Code>.
                </Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={ApiDocOutline} />}
            <Section text="Api Keys" id="api-keys-section">
                <Paragraph>
                    As described in{' '}
                    <Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.ProjectsAndRoles))} variant="body1">
                        Projects
                    </Link>
                    , three API Keys are provided per Project which may be regenerated at any time. Regenerating API Keys immediately renders previously issued
                    API Keys ineffective. The API keys serve distinct purposes as outlined below.
                </Paragraph>
                <DescriptiveList descriptions={apiKeyDescriptions} />
                <Paragraph>
                    <Bold>
                        The Live and Test API Keys are only accepted for <HttpMethod method="POST" /> requests made to the <Code>/breadcrumbs</Code> endpoint.
                        The Project API Key must be used for requests to other resources within the Project or Organization.
                    </Bold>
                </Paragraph>
                <Paragraph>
                    API Keys are expected to be included in the <Code>X-Ranger-ApiKey</Code> header.
                </Paragraph>
            </Section>
            <Section text="Versioning" id="versioning-section">
                <Paragraph>
                    To support future enhancements and modifications to Ranger's APIs, all of Ranger's APIs are versioned. As such, Ranger expects a version
                    header in all requests. Requests failing to provide the header or specifying an invalid API Version will be responded to with a{' '}
                    <Code>400 Bad Request</Code> response.
                </Paragraph>
                <Paragraph>
                    The current Ranger API version is <Code>1.0</Code>.
                </Paragraph>
                <Paragraph>
                    The API version is expected to be included in the <Code>API-Version</Code> header.
                </Paragraph>
            </Section>
            <Section text="Responses" id="responses-section">
                <Paragraph>
                    To enable the development of consistent clients, Ranger's APIs produce consistent responses for all standard HTTP status codes. The
                    following are status codes which may be expected from Ranger's APIs:
                </Paragraph>
                <Block>
                    <BulletedUnorderedList items={responseCodes} />
                </Block>
                <Paragraph>
                    The following display a standard responses for successful and unsuccessful requests. The <Code>isError</Code> property may be used to
                    determine whether an error or result should be deserialized.
                </Paragraph>
                <JsonViewer title="Successful Response" json={SuccessfulResponseBody} expandLevel={2} />
                <JsonViewer title="Unsuccessful Response" json={UnsuccessfulResponseBody} expandLevel={2} />
            </Section>
            <Section text="Breadcrumbs" id="breadcrumbs-section">
                <SubSection text="POST" id="post-breadcrumbs-section"></SubSection>
                <SampleRequest>
                    <JsonViewer title="POST Breadcrumb" json={PostBreadcrumb} expandLevel={3} />
                </SampleRequest>
            </Section>
            <Section text="Geofences" id="geofences-section">
                <SubSection text="GET" id="get-geofences-section"></SubSection>
                <SubSection text="POST" id="post-geofences-section"></SubSection>
                <SubSection text="PUT" id="put-geofences-section"></SubSection>
                <SubSection text="DELETE" id="delete-geofences-section"></SubSection>
            </Section>
            <Section text="Integrations" id="integrations-section">
                <SubSection text="GET" id="get-integrations-section"></SubSection>
            </Section>
        </React.Fragment>
    );
};

export default connect(null, { push })(ApiDoc);
