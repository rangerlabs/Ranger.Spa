import React from 'react';
import { Link as MailLink, Link } from '@material-ui/core';
import Paragraph from '../docComponents/Paragraph';
import WebhookDoc from './integrations/WebhookDoc';
import ComingSoon from './integrations/ComingSoon';
import { OutlineElement } from '../docComponents/OutlineElement';
import Outline from '../docComponents/Outline';
import Introduction from '../docComponents/Introduction';
import Section from '../docComponents/Section';
import Bold from '../textEnhancers/Bold';
import DocRoutePaths from '../DocRoutePaths';
import RoutePaths from '../../../RoutePaths';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PusherDoc from './integrations/PusherDoc';

interface IntegrationsDocProps {
    push: typeof push;
}
export const IntegrationsDocOutline = [
    {
        name: 'Integrations',
        id: 'integrations-section',
    },
    { name: 'Webhooks', id: 'webhook-section' },
    { name: 'Pusher Channels', id: 'pusher-section' },
    { name: 'Coming Soon', id: 'coming-soon' },
] as OutlineElement[];

const IntegrationsDoc = function (props: IDocProps & IntegrationsDocProps) {
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
                    To enable the advanced customization of Geofences, Ranger has the notion of <Bold>Default</Bold> and <Bold>Non-Default</Bold> Integrations.
                    At any time, an Integration may be promoted or demoted from one state to the other. Default Integrations are unique in that they execute for
                    all events triggered by all Geofences. Non-Default Integrations, however, are only executed when they are explicitely added to a Geofence.
                    Only Non-Default Integrations can be added on a per-Geofence basis.
                </Paragraph>
                <Paragraph>
                    This unique functionality enables you to perform A/B Testing, Canary Releases, or run different promotions for different geographical
                    regions. There are endless combinations of how Integrations may be executed.
                </Paragraph>
                <Paragraph>
                    Once you find that an Integration is performing the way you expect, it can be promoted to a Default Integration and all events from all
                    Geofences will execute it.
                </Paragraph>
                <Paragraph>
                    For all Integrations, the selected Environment will determine which API key executes the Integration. Use the <Bold>TEST</Bold> environment
                    to validate your Integration using the <Bold>TEST</Bold> API key or the Geofence Test Runner.
                </Paragraph>
                <Paragraph>
                    Due to the eventually consistent nature of Ranger, system may not necessarily receive events in order they are raised. Though Ranger strives
                    to be consistent within a matter of seconds, decreasing the frequency of each device's Breadcrumb requests can improve Ranger's
                    classification of Breadcrumb events. For example, if two Breadcrumbs are sent almost immediately after one another, it is possible a system
                    receives the <Bold>DWELLING</Bold> event before the <Bold>ENTERED</Bold> event. Increasing the time between Breadcrumbs reduces the
                    likelihood of this occurring. To learn more about sending Breadcrumbs, view the documentation{' '}
                    <Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Breadcrumbs))} variant="body1">
                        here
                    </Link>
                    .
                </Paragraph>
            </Section>
            <WebhookDoc />
            <PusherDoc />
            <ComingSoon />
        </React.Fragment>
    );
};

export default connect(null, { push })(IntegrationsDoc);
