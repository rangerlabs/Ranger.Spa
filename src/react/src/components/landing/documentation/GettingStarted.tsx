import React from 'react';
import CentralPark from '../../../../assets/central-park.png';
import ProjectEdit from '../../../../assets/project-edit.png';
import IntegrationSelect from '../../../../assets/integration-select.png';
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

export const GettingStartedDocOutline = [
    {
        name: 'Getting Started',
        id: 'getting-started-section',
    },
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
] as OutlineElement[];

interface GettingStartedProps extends IDocProps {
    push: typeof push;
}

const GettingStarted = function (props: GettingStartedProps) {
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
                <Paragraph>Ranger's easy-to-use interface allows you to quickly vizualize, create, edit, and test Geofences all from the same UI.</Paragraph>
                <Image src={CentralPark} alt="Central Park Geofence" />
                <Paragraph>
                    Create custom Geofence schedules, add unique metadata, configure which events get triggered, and where those events get sent - all on a per
                    geofence basis.
                </Paragraph>
                <Paragraph>
                    To learn more about Ranger's extensively customizable Geofences, take a look at our dedicated{' '}
                    <Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Geofences))} variant="body1">
                        Geofencing
                    </Link>{' '}
                    documentation.
                </Paragraph>
            </Section>
            <Section id="flexible-integrations-section" text="Flexible Integrations">
                <Paragraph>
                    Ranger was built to be extended. Ranger currently offers Webhook and Pusher Integrations with more under active development.
                </Paragraph>
                <Image src={IntegrationSelect} alt="available integrations" />
                <Paragraph>What's more, all Integrations will be available to all subscriptions - which Integrations you choose is up to you.</Paragraph>
                <Paragraph>
                    To learn more about creating and managing Integrations in Ranger, take a look at our dedicated{' '}
                    <Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Integrations))} variant="body1">
                        Integration
                    </Link>{' '}
                    documentation.
                </Paragraph>
            </Section>
            <Section id="secure-projects-section" text="Secure Projects">
                <Paragraph>
                    Group Geofences and the Integrations they can execute into Projects. Depending on your use case, Projects could be scoped to a mobile app,
                    customer, or organizational unit.
                </Paragraph>
                <Image src={ProjectEdit} alt="secure projects" />
                <Paragraph>Within your organization User Accounts can also be scoped to specific Projects.</Paragraph>
                <Paragraph>
                    To learn more about managing Projects and Project security, take a look at our dedicated{' '}
                    <Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.ProjectsAndRoles))} variant="body1">
                        Projects
                    </Link>{' '}
                    documentation.
                </Paragraph>
            </Section>
        </React.Fragment>
    );
};

export default connect(null, { push })(GettingStarted);
