import React from 'react';
import { Link } from '@material-ui/core';
import NewIntegration from '../../../../assets/new-integration.png';
import Outline from '../docComponents/Outline';
import SectionHeader from '../docComponents/SectionHeader';
import Block from '../docComponents/Block';
import Paragraph from '../docComponents/Paragraph';
import Header from '../docComponents/Header';
import Image from '../docComponents/Image';
import WebhookResult from '../json/WebhookResult';
import JsonViewer from '../docComponents/JsonViewer';

const outline = [{ name: 'Webhooks', id: 'webhook-section' }];

const IntegrationsDoc = function () {
    return (
        <React.Fragment>
            <Header text="Integrations" />
            <Block>
                <Paragraph>Ranger's Webhook Integration enables you to forward geofence events to any HTTPS endpoint.</Paragraph>
            </Block>
            <Block>
                <Paragraph>
                    Integrations enable Ranger to communicate to the systems your organiation and services depend on. Ranger's platform was built to be extended
                    and more integrations will come as our team learns our customer's needs. If you would like to request that Ranger integrate with a
                    particular service, send a recommendation to <Link href="mailto:info@rangerlabs.io">info@rangerlabs.io</Link>.
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
                    configure your Webhook.
                </Paragraph>
            </Block>
            <Image src={NewIntegration} alt="New Integration" />
            <Block>
                <Paragraph>
                    The selected Environment will determine which API key executes the new Integration. Use the TEST environment to validate your Integration
                    using the TEST API key or the Geofence Test Runner. The Geofence Test Runner only executes Integrations in the TEST environment. Any valid
                    HTTPS endpoint can be provided for Webhooks.
                </Paragraph>
                <Paragraph>
                    Webhook Integrations also permit Header and Metadata key-value pairs to be configured and encrypted at rest. Duplicate keys are permitted.
                </Paragraph>
            </Block>
            <JsonViewer json={WebhookResult} />
        </React.Fragment>
    );
};

export default IntegrationsDoc;
