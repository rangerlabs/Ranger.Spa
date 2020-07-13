import React from 'react';
import CentralPark from '../../../../assets/central-park.png';
import ProjectEdit from '../../../../assets/project-edit.png';
import WebhookSelect from '../../../../assets/webhook-select.png';
import RoutePaths from '../../RoutePaths';
import Header from './docComponents/Header';
import Block from './docComponents/Block';
import Paragraph from './docComponents/Paragraph';
import SectionHeader from './docComponents/SectionHeader';
import Image from './docComponents/Image';
import { Link } from 'react-router-dom';

const GettingStarted = function () {
    return (
        <React.Fragment>
            <Header text="Getting Started" />
            <Block>
                <Paragraph>
                    At Ranger we provide hosted APIs for boundless geofencing services. Our growing list of location-centric APIs and Integrations will enable
                    you to easily implement cloud-native location services into your mobile apps.
                </Paragraph>
                <Paragraph>This section provides a brief overview of the Ranger platform.</Paragraph>
            </Block>
            <SectionHeader text="Unrivaled Geofencing" />

            <Block>
                <Paragraph>Ranger's easy-to-use interface allows you to quickly vizualize, create, edit, and test geofences all from the same UI.</Paragraph>
            </Block>
            <Image src={CentralPark} alt="Central Park Geofence" />
            <Block>
                <Paragraph>
                    Create custom geofence schedules, add unique metadata, configure which events get triggered, and where those events get sent - all on a per
                    geofence basis.
                </Paragraph>
            </Block>
            <Block>
                <Paragraph>
                    To learn more about Ranger's extensively customizable geofences, take a look at our dedicated{' '}
                    <Link to={RoutePaths.Docs.replace(':name?', 'geofences')}>Geofencing</Link> documentation.
                </Paragraph>
            </Block>

            <SectionHeader text="Flexible Integrations" />
            <Block>
                <Paragraph>
                    Ranger was built to be extended. Ranger currently offers Webhook integrations, but more are in the works and will be coming online shortly.
                </Paragraph>
            </Block>
            <Image src={WebhookSelect} alt="central-park-geofence" />
            <Block>
                <Paragraph>What's more, all integrations will be available to all subscriptions - which Integrations you choose is up to you.</Paragraph>
            </Block>
            <Block>
                <Paragraph>
                    To learn more about creating and managing Integrations in Ranger, take a look at our dedicated{' '}
                    <Link to={RoutePaths.Docs.replace(':name?', 'integrations')}>Integration</Link> documentation.
                </Paragraph>
            </Block>
            <SectionHeader text="Secure Projects" />
            <Block>
                <Paragraph>
                    Group Geofences and the Integrations they can execute into Projects. Depending on your use case, Projects could be scoped to a mobile app,
                    customer, or organizational unit.
                </Paragraph>
            </Block>
            <Image src={ProjectEdit} alt="central-park-geofence" />
            <Block>
                <Paragraph>Within your organization User Accounts can also be scoped to specific projects.</Paragraph>
            </Block>
            <Block>
                <Paragraph>
                    To learn more about managing Projects and Project security, take a look at our dedicated{' '}
                    <Link to={RoutePaths.Docs.replace(':name?', 'projects')}>Projects</Link> documentation.
                </Paragraph>
            </Block>
        </React.Fragment>
    );
};

export default GettingStarted;
