import React from 'react';
import { Link as MailLink } from '@material-ui/core';
import Outline from '../docComponents/Outline';
import Block from '../docComponents/Block';
import Paragraph from '../docComponents/Paragraph';
import Header from '../docComponents/Header';
import Webhooks from './integrations/Webhooks';
import ComingSoon from './integrations/ComingSoon';

export const IntegrationsDocOutline = [
    { name: 'Webhooks', id: 'webhook-section' },
    { name: 'Coming Soon', id: 'coming-soon' },
];

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
            <Webhooks />
            <ComingSoon />
        </React.Fragment>
    );
};

export default IntegrationsDoc;
