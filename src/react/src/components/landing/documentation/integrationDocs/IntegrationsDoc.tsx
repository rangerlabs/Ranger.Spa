import React from 'react';
import { Link as MailLink } from '@material-ui/core';
import Paragraph from '../docComponents/Paragraph';
import Webhooks from './integrations/Webhooks';
import ComingSoon from './integrations/ComingSoon';
import { OutlineElement } from '../docComponents/OutlineElement';
import Outline from '../docComponents/Outline';
import Introduction from '../docComponents/Introduction';
import Section from '../docComponents/Section';

export const IntegrationsDocOutline = [
    {
        name: 'Integrations',
        id: 'integrations-section',
    },
    { name: 'Webhooks', id: 'webhook-section' },
    { name: 'Coming Soon', id: 'coming-soon' },
] as OutlineElement[];

const IntegrationsDoc = function (props: IDocProps) {
    return (
        <React.Fragment>
            <Introduction id="integrations-section" text="Integrations">
                <Paragraph>
                    Integrations enable Ranger to communicate to the systems your organiation and services depend on. Ranger's platform was built to be extended
                    and more integrations will come as our team learns our customer's needs. If you would like to request that Ranger integrate with a
                    particular service, send a recommendation to <MailLink href="mailto:info@rangerlabs.io">info@rangerlabs.io</MailLink>.
                </Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={IntegrationsDocOutline} />}
            <Section id="default-integrations-section" text="Default Integrations">
                <Paragraph>
                    To enable the advanced customization of Geofences, Ranger has the notion of 'Default' and 'Non-Default' Integrations. At any time, an
                    Integration may be promoted or demoted from one state to the other. Default Integrations are unique in that they execute for all events
                    triggered by all geofences. Non-Default Integrations, however, are only executed when they are explicitely added to a Geofence. Only
                    Non-Default Integrations can be added on a per-Geofence basis.
                </Paragraph>
                <Paragraph>
                    This unique functionality enables you to perform A/B Testing, Canary Releases, or run different promotions for different geographical
                    regions. The combinations are endless.
                </Paragraph>
                <Paragraph>
                    Once you find that an Integration is performing the way you expect, it can be promoted to a Default Integration and all events from all
                    Geofences will execute it.
                </Paragraph>
            </Section>
            <Webhooks />
            <ComingSoon />
        </React.Fragment>
    );
};

export default IntegrationsDoc;
