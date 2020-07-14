import React from 'react';
import { Link as MailLink } from '@material-ui/core';
import NewIntegration from '../../../../../assets/new-integration.png';
import Outline from '../docComponents/Outline';
import SectionHeader from '../docComponents/SectionHeader';
import Block from '../docComponents/Block';
import Paragraph from '../docComponents/Paragraph';
import Header from '../docComponents/Header';
import Image from '../docComponents/Image';
import WebhookResult from '../json/WebhookResult';
import JsonViewer from '../docComponents/JsonViewer';
import HttpMethod from '../TextEnhancers/HttpMethod';
import Bold from '../TextEnhancers/Bold';
import { Link } from 'react-router-dom';

const outline = [{ name: 'Webhooks', id: 'webhook-section' }];

const IntegrationsDoc = function () {
    return (
        <React.Fragment>
            <Header text="Integrations" />
            <Block>
                <Paragraph>
                    Integrations enable Ranger to communicate to the systems your organiation and services depend on. Ranger's platform was built to be extended
                    and more integrations will come as our team learns our customer's needs. If you would like to request that Ranger integrate with a
                    particular service, send a recommendation to <MailLink href="mailto:info@rangerlabs.io">info@rangerlabs.io</MailLink>.
                </Paragraph>
            </Block>
            <Outline elements={outline} />
            <SectionHeader text="Webhooks" id="webhook-section" />
            <Block>
                <Paragraph>Ranger's Webhook Integration enables you to forward geofence events to any HTTPS endpoint.</Paragraph>
            </Block>
            <Block>
                <Paragraph>
                    To begin receiving Webhook events, Select 'New' on the integrations page and select the 'Webhook' Integration type. You will be prompted to
                    configure your Webhook. Webhook events are sent via HTTP <HttpMethod method="POST" /> with the event payload contained in the request body.
                    Any valid HTTPS endpoint can be provided for Webhooks.
                </Paragraph>
            </Block>
            <Block>
                <Paragraph>
                    Due to the eventually consistent nature of Ranger, your system may not necessarily receive events in order. Though Ranger strives to be
                    consistent within a matter of seconds, decreasing the frequency of each device's Breadcrumb requests can improve Ranger's classification of
                    Breadcrumb events. For example, if two Breadcrumbs are sent almost immediately after one another, it is possible your system receives the
                    <Bold>DWELLING</Bold> event before the <Bold>ENTERED</Bold> event. Increasing the time between Breadcrumbs reduces the likelihood of this
                    occurring. To learn more about sending Breadcrumbs, view the documentation <Link to="">Breadcrumbs</Link>.
                </Paragraph>
                <Image src={NewIntegration} alt="New Integration" maxWidth={60} />
            </Block>
            <Block>
                <Paragraph>
                    The selected Environment will determine which API key executes the Integration. Use the <Bold>TEST</Bold> environment to validate your
                    Integration using the <Bold>TEST</Bold> API key or the Geofence Test Runner.
                </Paragraph>
            </Block>
            <Block>
                <Paragraph>
                    Webhook Integrations also permit Header and Metadata key-value pairs to be configured and are encrypted at rest. Headers may be used for API
                    Authorization or versioning. Metadata appear in the Webhook event body and can be useful to transfer data whenever the Integration is
                    executed. Duplicate keys are permitted.
                </Paragraph>
            </Block>
            <JsonViewer title={'Webhook Request Body Example'} json={WebhookResult} />
            <Block>
                <Paragraph>
                    To validate the authenticity of a Webhook event, the event <Bold>ID</Bold> is signed with the HMAC-SHA1 algorithm using the Signing Key
                    available on the Integration's details page. The event signature is found on the Webhook request's <Bold>x-ranger-signature</Bold> header.
                </Paragraph>
            </Block>
        </React.Fragment>
    );
};

export default IntegrationsDoc;
