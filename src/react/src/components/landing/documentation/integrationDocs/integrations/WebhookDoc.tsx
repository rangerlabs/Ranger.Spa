import React from 'react';
import NewWebhookIntegration from '../../../../../../assets/new-webhook-integration.png';
import Section from '../../docComponents/Section';
import Paragraph from '../../docComponents/Paragraph';
import Image from '../../docComponents/Image';
import WebhookResult from '../../json/integrations/WebhookResult';
import JsonViewer from '../../docComponents/JsonViewer';
import HttpMethod from '../../textEnhancers/HttpMethod';
import Bold from '../../textEnhancers/Bold';

const WebhookDoc = function () {
    return (
        <Section text="Webhooks" id="webhook-section">
            <Paragraph>Ranger's Webhook Integration enables you to forward geofence events to any HTTPS endpoint.</Paragraph>
            <Paragraph>
                To begin receiving Webhook events, Select 'New' on the integrations page and select the 'Webhook' Integration type. You will be prompted to
                configure your Webhook. Webhook events are sent via HTTP <HttpMethod method="POST" /> with the event payload contained in the request body.
            </Paragraph>
            <Image src={NewWebhookIntegration} alt="New Webhook Integration" maxWidth={60} />
            <Paragraph>
                Webhook Integrations also permit Header and Metadata key-value pairs to be configured and are encrypted at rest. Headers may be used for API
                Authorization or versioning. Metadata appear in the Webhook event body and can be useful to transfer data whenever the Integration is executed.
                Duplicate keys are permitted.
            </Paragraph>
            <Paragraph>The following is an example of a typical Webhook payload.</Paragraph>
            <JsonViewer title={'Webhook Event Payload Example'} json={WebhookResult} />
            <Paragraph>
                To validate the authenticity of a Webhook event, the event <Bold>ID</Bold> is signed with the HMAC-SHA1 algorithm using the Signing Key
                available on the Integration's details page. The event signature is found on the Webhook request's <Bold>x-ranger-signature</Bold> header.
            </Paragraph>
        </Section>
    );
};

export default WebhookDoc;
