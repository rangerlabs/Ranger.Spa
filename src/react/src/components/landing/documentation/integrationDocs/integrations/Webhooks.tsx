import React from 'react';
import NewIntegration from '../../../../../../assets/new-integration.png';
import Section from '../../docComponents/Section';
import Paragraph from '../../docComponents/Paragraph';
import Image from '../../docComponents/Image';
import WebhookResult from '../../json/WebhookResult';
import JsonViewer from '../../docComponents/JsonViewer';
import HttpMethod from '../../textEnhancers/HttpMethod';
import Bold from '../../textEnhancers/Bold';
import RoutePaths from '../../../../RoutePaths';
import DocRoutePaths from '../../DocRoutePaths';
import { Link } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

interface WebhooksProps {
    push: typeof push;
}

const Webhooks = function (props: WebhooksProps) {
    return (
        <Section text="Webhooks" id="webhook-section">
            <Paragraph>Ranger's Webhook Integration enables you to forward geofence events to any HTTPS endpoint.</Paragraph>
            <Paragraph>
                To begin receiving Webhook events, Select 'New' on the integrations page and select the 'Webhook' Integration type. You will be prompted to
                configure your Webhook. Webhook events are sent via HTTP <HttpMethod method="POST" /> with the event payload contained in the request body.
            </Paragraph>
            <Paragraph>
                Due to the eventually consistent nature of Ranger, your system may not necessarily receive events in order. Though Ranger strives to be
                consistent within a matter of seconds, decreasing the frequency of each device's Breadcrumb requests can improve Ranger's classification of
                Breadcrumb events. For example, if two Breadcrumbs are sent almost immediately after one another, it is possible your system receives the{' '}
                <Bold>DWELLING</Bold> event before the <Bold>ENTERED</Bold> event. Increasing the time between Breadcrumbs reduces the likelihood of this
                occurring. To learn more about sending Breadcrumbs, view the documentation{' '}
                <Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Breadcrumbs))} variant="body1">
                    here
                </Link>
                .
            </Paragraph>
            <Image src={NewIntegration} alt="New Integration" maxWidth={60} />
            <Paragraph>
                The selected Environment will determine which API key executes the Integration. Use the <Bold>TEST</Bold> environment to validate your
                Integration using the <Bold>TEST</Bold> API key or the Geofence Test Runner.
            </Paragraph>
            <Paragraph>
                Webhook Integrations also permit Header and Metadata key-value pairs to be configured and are encrypted at rest. Headers may be used for API
                Authorization or versioning. Metadata appear in the Webhook event body and can be useful to transfer data whenever the Integration is executed.
                Duplicate keys are permitted.
            </Paragraph>
            <JsonViewer title={'Webhook Request Body Example'} json={WebhookResult} />
            <Paragraph>
                To validate the authenticity of a Webhook event, the event <Bold>ID</Bold> is signed with the HMAC-SHA1 algorithm using the Signing Key
                available on the Integration's details page. The event signature is found on the Webhook request's <Bold>x-ranger-signature</Bold> header.
            </Paragraph>
        </Section>
    );
};

export default connect(null, { push })(Webhooks);
