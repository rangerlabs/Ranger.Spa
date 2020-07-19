import React from 'react';
import { Link as MailLink } from '@material-ui/core';
import Block from '../docComponents/Block';
import Paragraph from '../docComponents/Paragraph';
import Header from '../docComponents/Header';
import Webhooks from './integrations/Webhooks';
import ComingSoon from './integrations/ComingSoon';
import { OutlineElement } from '../docComponents/OutlineElement';

export const IntegrationsDocOutline = [
    {
        name: 'Integrations',
        id: 'integrations-section',
        subElements: [
            { name: 'Webhooks', id: 'webhook-section' },
            { name: 'Coming Soon', id: 'coming-soon' },
        ],
    },
] as OutlineElement[];

const IntegrationsDoc = function (props: IDocProps) {
    const { outline: OutlineElement } = props;
    return (
        <React.Fragment>
            <Header id="integrations-section" text="Integrations" />
            <Block>
                <Paragraph>
                    Integrations enable Ranger to communicate to the systems your organiation and services depend on. Ranger's platform was built to be extended
                    and more integrations will come as our team learns our customer's needs. If you would like to request that Ranger integrate with a
                    particular service, send a recommendation to <MailLink href="mailto:info@rangerlabs.io">info@rangerlabs.io</MailLink>.
                </Paragraph>
            </Block>
            <OutlineElement />
            <Webhooks />
            <ComingSoon />
        </React.Fragment>
    );
};

export default IntegrationsDoc;
