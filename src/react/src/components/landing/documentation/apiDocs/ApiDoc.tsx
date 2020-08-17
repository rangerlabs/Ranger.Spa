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

export const ApiDocOutline = [
    {
        name: 'Api',
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
] as OutlineElement[];

interface ApiDocsProps extends IDocProps {
    push: typeof push;
}

const apiKeyDescriptions = [
    {
        title: 'Live API key',
        description:
            'The Live API key is intended to be deployed into a production environment and will execute all Integrations whose environent is set to LIVE.',
    },
    {
        title: 'Test API key',
        description:
            'The Test API key is intended to be deployed to any non-production environment and will execute all Integrations whose environent is set to TEST.',
    },
    {
        title: 'Project API key',
        description:
            'The Project API key provides the ability to programatically manage a subset of resources within a Project. For example, this key can be used for CRUD operations on Geofence resources.',
    },
] as Description[];

const ApiDoc = function (props: ApiDocsProps) {
    return (
        <React.Fragment>
            <Introduction id="api-section" text="Geofences">
                <Paragraph>This page documents the available REST endpoints that clients may access via the API Keys provided for each Project. </Paragraph>
                <Paragraph>
                    While Ranger strives to be as RESTful as possible, there may be endpoints that deviate from pure REST standards. Additionally, because the
                    majority of Ranger's APIs are asynchronous, clients receiving <Code>202 Accepted</Code> responses should anticipate the need to query for
                    the result of their operation. Future API enhancments will provide clients a URI to query for the result of their operation.
                </Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={ApiDocOutline} />}
            <Section text="Api Keys" id="api-keys-section">
                <Paragraph>
                    As described in <Link onClick={() => props.push(RoutePaths.Projects)}>Projects</Link>, three API Keys are provided per Project which may be
                    regenerated at any time.
                </Paragraph>
                <Paragraph>These API keys serve distinct purposes:</Paragraph>
                <DescriptiveList descriptions={apiKeyDescriptions} />
                <Paragraph>
                    The <Bold>Live</Bold> and <Bold>Test</Bold> API Keys are only accepted when a <HttpMethod method="POST" /> request is made to the{' '}
                    <Code>/breadcrumbs</Code> endpoint. For requests relating to other resources within the Project or Organization, the <Bold>Project</Bold>
                    API Key should be used.
                </Paragraph>
            </Section>
            <Section text="Versioning" id="versioning-section">
                <Paragraph>
                    To support future enhancements and modifications to Ranger's APIs, all of Ranger's APIs are versioned. As such, Ranger expects a version
                    header in all requests. The current Ranger API version is <Code>1.0</Code>. Requests should include the header as follows, requests failing
                    to provide the header or specifying an invalid API Version will be responded to with a <Code>400 Bad Request</Code> response.
                </Paragraph>
                <Paragraph>
                    <Code>API-Version: 1.0</Code>
                </Paragraph>
            </Section>
            <Section text="Responses" id="responses-section">
                <Paragraph></Paragraph>
            </Section>
        </React.Fragment>
    );
};

export default connect(null, { push })(ApiDoc);
