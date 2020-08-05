import React from 'react';
import CentralPark from '../../../../assets/central-park.png';
import ProjectEdit from '../../../../assets/project-edit.png';
import WebhookSelect from '../../../../assets/webhook-select.png';
import RoutePaths from '../../RoutePaths';
import Paragraph from './docComponents/Paragraph';
import Section from './docComponents/Section';
import Image from './docComponents/Image';
import { Link } from 'react-router-dom';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Introduction from './docComponents/Introduction';

export const GettingStartedDocOutline = [
    {
        name: 'Getting Started',
        id: 'getting-started-section',
        subElements: [
            {
                name: 'Unrivaled Geofencing',
                id: 'unrivaled-geofencing-section',
            },
            {
                name: 'Flexible Integrations',
                id: 'flexible-integrations-section',
            },
            {
                name: 'Secure Projects',
                id: 'secure-projects-section',
            },
        ],
    },
] as OutlineElement[];

const GettingStarted = function (props: IDocProps) {
    return (
        <React.Fragment>
            <Introduction id="getting-started-section" text="Getting Started">
                <Paragraph>
                    Ranger provides hosted APIs for boundless geofencing services. Our growing list of location-centric APIs and Integrations will enable you to
                    easily implement cloud-native location services into your mobile apps.
                </Paragraph>
                <Paragraph>This section provides a brief overview of the Ranger platform.</Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={GettingStartedDocOutline} />}
            <Section id="unrivaled-geofencing-section" text="Unrivaled Geofencing">
                <Paragraph>Ranger's easy-to-use interface allows you to quickly vizualize, create, edit, and test geofences all from the same UI.</Paragraph>
                <Image src={CentralPark} alt="Central Park Geofence" />
                <Paragraph>
                    Create custom geofence schedules, add unique metadata, configure which events get triggered, and where those events get sent - all on a per
                    geofence basis.
                </Paragraph>
                <Paragraph>
                    To learn more about Ranger's extensively customizable geofences, take a look at our dedicated{' '}
                    <Link to={RoutePaths.Docs.replace(':name?', 'geofences')}>Geofencing</Link> documentation.
                </Paragraph>
            </Section>
            <Section id="flexible-integrations-section" text="Flexible Integrations">
                <Paragraph>
                    Ranger was built to be extended. Ranger currently offers Webhook integrations, but more are in the works and will be coming online shortly.
                </Paragraph>
                <Image src={WebhookSelect} alt="central-park-geofence" />
                <Paragraph>What's more, all integrations will be available to all subscriptions - which Integrations you choose is up to you.</Paragraph>
                <Paragraph>
                    To learn more about creating and managing Integrations in Ranger, take a look at our dedicated{' '}
                    <Link to={RoutePaths.Docs.replace(':name?', 'integrations')}>Integration</Link> documentation.
                </Paragraph>
            </Section>
            <Section id="secure-projects-section" text="Secure Projects">
                <Paragraph>
                    Group Geofences and the Integrations they can execute into Projects. Depending on your use case, Projects could be scoped to a mobile app,
                    customer, or organizational unit.
                </Paragraph>
                <Image src={ProjectEdit} alt="central-park-geofence" />
                <Paragraph>Within your organization User Accounts can also be scoped to specific projects.</Paragraph>
                <Paragraph>
                    To learn more about managing Projects and Project security, take a look at our dedicated{' '}
                    <Link to={RoutePaths.Docs.replace(':name?', 'projects')}>Projects</Link> documentation.
                </Paragraph>
            </Section>
        </React.Fragment>
    );
};

export default GettingStarted;
