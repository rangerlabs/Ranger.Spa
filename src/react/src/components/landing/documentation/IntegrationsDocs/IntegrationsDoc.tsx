import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles, Box, List, ListItem, ListItemText, Link, ListItemIcon, Button } from '@material-ui/core';
import NewApiKeys from '../../../../assets/new-api-keys.png';
import Outline from '../docComponents/Outline';
import SectionHeader from '../docComponents/SectionHeader';
import Block from '../docComponents/Block';
import Paragraph from '../docComponents/Paragraph';
import Header from '../docComponents/Header';

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
            <SectionHeader text="Webhooks" />
            <Block>
                <Paragraph>Ranger's Webhook Integration enables you to forward geofence events to any HTTPS endpoint.</Paragraph>
            </Block>
            <Block>
                <Paragraph>To begin receiving Webhook events, Select 'New' on the integrations page and select the 'Webhook' Integration type.</Paragraph>
            </Block>
        </React.Fragment>
    );
};

export default IntegrationsDoc;
