import React from 'react';
import SubscriptionManagement from '../../../../assets/subscription-management.png';
import RoutePaths from '../../RoutePaths';
import Paragraph from './docComponents/Paragraph';
import Section from './docComponents/Section';
import Image from './docComponents/Image';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Introduction from './docComponents/Introduction';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Link } from '@material-ui/core';
import DocRoutePaths from './DocRoutePaths';
import Bold from './textEnhancers/Bold';
import DescriptiveList, { Description } from './docComponents/DescriptiveList';
import Code from './textEnhancers/Code';

export const SubscriptionDocOutline = [
    {
        name: 'Subscription',
        id: 'subscription-section',
    },
    {
        name: 'Upgrade Subscription',
        id: 'upgrade-section',
    },
    {
        name: 'Downgrade Subscription',
        id: 'downgrade-section',
    },
    {
        name: 'Pause/Cancel Subscription',
        id: 'pause-cancel-section',
    },
] as OutlineElement[];

const downgradeProcess = [
    {
        title: 'Project Removal',
        description: 'Projects are removed in the opposite order they were created until they meet the subscription limit.',
    },
    {
        title: 'Integration and Geofence Removal',
        description:
            'Next, if the number of Integrations and Geofences still exceeds the subscription limit after Project removal, they will now be removed in the opposite order they were created until they meet the subscription limits.',
    },
] as Description[];

interface SubscriptionDocProps extends IDocProps {
    push: typeof push;
}

const SubscriptionDoc = function (props: SubscriptionDocProps) {
    return (
        <React.Fragment>
            <Introduction id="subscription-section" text="Subscription">
                <Paragraph>
                    Ranger allows you to easily manage your subscription all from within the application. At any time you may upgrade, downgrade, pause, or
                    cancel your subscription. Only Owners and the Primary Owner can modify an organization's subscription.
                </Paragraph>
                <Image src={SubscriptionManagement} alt="Subscription Management" />
            </Introduction>
            {props.showOutline && <Outline elements={SubscriptionDocOutline} />}
            <Section id="upgrade-section" text="Upgrade">
                <Paragraph>
                    To upgade a subscription, select the plan most applicable to you and follow the on screen prompts. Once complete, your new subscription
                    limits will become available shortly thereafter without the need to refresh your browser.
                </Paragraph>
            </Section>
            <Section id="downgrade-section" text="Downgrade">
                <Paragraph>
                    When downgrading a subscription certain events occur within Ranger to ensure resources are kept within the subscription level's limits.
                    Subscription limits are enforced at several varying intervals a day and will not be immediately visible once the downgrade is complete.
                </Paragraph>
                <Paragraph>
                    <Bold>
                        These events can be avoided if precautions are taken. To avoid the events described below from occuring, remove resources to be within
                        the subcription limits of the plan you intend to downgrade to BEFORE downgrading your subscription.
                    </Bold>
                </Paragraph>
                <Paragraph>
                    When downgrading to a plan where your current resource utilization exceeds the plan's permitted utilization, the following occur in order:
                </Paragraph>
                <DescriptiveList descriptions={downgradeProcess} />
            </Section>
            <Section id="pause-cancel-section" text="Pause or Cancel">
                <Paragraph>
                    To pause or cancel your subscription and still retain the current state of your organization, select the <Bold>MANAGE</Bold> button in the
                    section detailing your utilization. Pausing or cancelling your subscription will have the same effect as non-payment for a subscription and
                    will result in the rejection of Breadcrumbs with a <Code>402 Payment Required</Code> status code.
                </Paragraph>
                <Paragraph>Subscriptions will automatically be cancelled when an organization is deleted.</Paragraph>
            </Section>
        </React.Fragment>
    );
};

export default connect(null, { push })(SubscriptionDoc);
