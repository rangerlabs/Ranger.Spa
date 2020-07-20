import React from 'react';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Section from './docComponents/Section';
import Image from './docComponents/Image';
import Introduction from './docComponents/Introduction';
import SpeedDial from '../../../../assets/speed-dial.png';
import NewGeofence from '../../../../assets/new-geofence.png';
import Bold from './TextEnhancers/Bold';
import DescriptiveList, { Description } from './docComponents/DescriptiveList';

export const GeofencesDocOutline = [
    {
        name: 'Geofences',
        id: 'geofences-section',
        subElements: [
            {
                name: 'Interface',
                id: 'interface-section',
            },
            {
                name: 'Events',
                id: 'events-section',
            },
            {
                name: 'Integrations',
                id: 'integrations-section',
            },
            {
                name: 'Schedules',
                id: 'schedule-section',
            },
            {
                name: 'Metadata',
                id: 'metadata-section',
            },
            {
                name: 'Test Runs',
                id: 'test-run-section',
            },
        ],
    },
] as OutlineElement[];

const EventDescriptions = [
    {
        title: 'Entered',
        description: 'Send events when a user enters this geofence',
    },
    {
        title: 'Dwelling',
        description: 'Send events when a user has entered and is continuing to dwell within this geofence.',
    },
    {
        title: 'Exited',
        description: 'Send events when a user has entered and then exits this geofence.',
    },
] as Description[];

const ProjectsDoc = function (props: IDocProps) {
    return (
        <React.Fragment>
            <Introduction id="geofences-section" text="Geofences">
                <Paragraph>
                    Geofences make location data actionable. Using Geofences you can sift through the noise of in-actionable location data and reach your
                    customers when the moment counts. Using Ranger's Integrations you can seemlessly integrate Geofence events into your existing platforms.
                </Paragraph>
                <Paragraph>
                    Ranger supports Geofences of any size and in nearly any configuration including Circular Geofences, Polygon Geofences, and Geofences which
                    overlap with one another. The easy to use Geofencing UI allows you to vizualize, create, and edit all of your Geofences in a single view.
                </Paragraph>
                <Paragraph>Customers will soon be able to perform CRUD operations on Geofences using their Project API key.</Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={GeofencesDocOutline} />}
            <Section text="Interface" id="interface-section">
                <Paragraph>
                    To get started creating Geofences, select the Map option from the main navigation. You can quickly navigate to the location of where the
                    Geofence must be placed by using the search bar. Once you have arrived at the location of the geofence, hover over the Speed Dial icon to
                    select the shape of the Geofence. Once a shape has been selected, you will see Cancel and Save options become present. You can cancel the
                    creation of a Geofence at anytime.
                </Paragraph>
                <Image src={SpeedDial} alt="Map Speed Dial" />
                <Paragraph>
                    If you chose to create a Circular Geofence, clicking the map will initialize a new Geofence centered where you clicked. By default, Circular
                    geofences have a radius of 100 meters, but users are encouraged to make Geofences as large as reasonable to account for variations in mobile
                    device accuracy. Device accuracy may optionally be included in Breadcrumbs sent to Ranger's API and will be included in Geofence events.
                </Paragraph>
                <Paragraph>
                    When choosing to create a Polygon Geofence, clicking the map will create a new vertex for the polygon. Continue to drop vertices along the
                    intended Geofence edges and close the Geofence by selecting the first vertex. Once the Polygon Geofence has been closed, new edged can be
                    created by dragging the hallow circles along the polygon's edges. Ranger does not support self-intersecting polygons.
                </Paragraph>
                <Paragraph>
                    Once the Geofence covers the intended area, click Save to open the Geofence Configuration Drawer. Note that while configuring the Geofence,
                    it may still be modified or dragged to its desired location.
                </Paragraph>
                <Image src={NewGeofence} alt="Geofence Configuration Drawer" />
                <Paragraph>
                    Once in the Geofence Configuration Drawer the Geofence can be given a unique <Bold>ExternalId</Bold> that can be used to identify the
                    Geofence by your system. An optional <Bold>Description</Bold> may also be provided. Geofences can temporarily be disabled by toggling the
                    Enabled/Disabled checkbox. The following sections describe Geofence Configuration in greater detail.
                </Paragraph>
            </Section>
            <Section text="Events" id="events-section">
                <Paragraph>
                    You can toggle which events you want to trigger your configured Integrations. By default, Ranger recommends triggering your configured
                    Integrations when your users <Bold>Enter</Bold> and <Bold>Exit</Bold> the Geofence being configured. You may also choose to receive events
                    when users <Bold>Dwell</Bold> within a Geofence. Be aware, depending on the size of your geofences and your user's behavior, choosing to be
                    alerted while users <Bold>Dwell</Bold> may dramatically increase the amount of events that trigger your Integrations. Be especially cautious
                    when automating based on <Bold>Dwell</Bold> events.
                </Paragraph>
                <Paragraph>The following describes the events:</Paragraph>
                <DescriptiveList descriptions={EventDescriptions} />
            </Section>
            <Section text="Integrations" id="events-section">
                <Paragraph></Paragraph>
            </Section>
            <Section text="Schedules" id="schedules-section">
                <Paragraph></Paragraph>
            </Section>
        </React.Fragment>
    );
};

export default ProjectsDoc;
