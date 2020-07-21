import React from 'react';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Section from './docComponents/Section';
import Image from './docComponents/Image';
import Introduction from './docComponents/Introduction';
import SpeedDial from '../../../../assets/speed-dial.png';
import NewGeofence from '../../../../assets/new-geofence.png';
import GeofenceSchedule from '../../../../assets/example-schedule.png';
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
                id: 'schedules-section',
            },
            {
                name: 'Metadata',
                id: 'metadata-section',
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
                    customers when the moment counts. Ranger's Integrations allow you to seamlessly integrate Geofence events into your existing platforms.
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
                    You can toggle which events you want to execute your configured Integrations. By default, Ranger recommends triggering your configured
                    Integrations when your users <Bold>Enter</Bold> and <Bold>Exit</Bold> the Geofence being configured. You may also choose to receive events
                    when users <Bold>Dwell</Bold> within a Geofence. Be aware, depending on the size of your geofences and your user's behavior, choosing to be
                    alerted while users <Bold>Dwell</Bold> may dramatically increase the amount of events that execute your Integrations. Be especially cautious
                    when automating based on <Bold>Dwell</Bold> events.
                </Paragraph>
                <Paragraph>The following describes the events in more detail:</Paragraph>
                <DescriptiveList descriptions={EventDescriptions} />
            </Section>
            <Section text="Integrations" id="integrations-section">
                <Paragraph>
                    The ability to configure which Integrations a Geofence's events execute makes Ranger extremely configurable. It enables your organization to
                    gather metrics or run promotions on only a subset of your Geofences without having to create complex segments. When a user's behavior raises
                    a Geofence event, only those Integrations selected for that Geofence will be executed. Create Integrations for Analytics, Email or Push
                    Notifications, Rewards Programs, etc. and mix-and-match as needed.
                </Paragraph>
            </Section>
            <Section text="Schedules" id="schedules-section">
                <Paragraph>
                    In addition to mix-and-match Integrations, Ranger's unique Geofence scheduling functionality allows unprecedented control over when
                    Integrations get triggered. By default, Integrations can be executed at all times of the day, but scheduling allows you to only execute
                    Integrations when you choose. After all, there may not be a need to send that Push Notification if it's after retail hours.
                </Paragraph>
                <Paragraph>
                    Geofences may cross timezone boundaries and as a result it's important to remember to specify a timezone for the Geofence schedule. This
                    will ensure when Breadcrumbs are received by Ranger, the time that the Breadcrumb was recorded at will be converted to the correct timezone
                    to determine if it is within the configured schedule.
                </Paragraph>
                <Image src={GeofenceSchedule} alt="Example Geofence Schedule" />
                <Paragraph>
                    The above schedule indicates that Ranger should execute Integrations when events occur between the times of 9:00 AM - 5:00 PM, Monday -
                    Friday, and not execute any Integrations on Saturday or Sunday.
                </Paragraph>
            </Section>
            <Section text="Metadata" id="metadata-section">
                <Paragraph>
                    With Geofence metadata you have the ability to provide additional context when a Geofence event gets raised. Using metadata you can create a
                    common set of key-value pairs across your system to easily understand properties of a Geofence without the need to look them up after the
                    fact. One example may be that each Geofence across your Project has a <Bold>Venue</Bold> key and appropriate values such as{' '}
                    <Bold>Restaurant</Bold>, <Bold>Retail</Bold>, or <Bold>Entertainment</Bold>.
                </Paragraph>
                <Paragraph>
                    It is important to stress that, unlike Integration Headers and Metadata, Geofence Metadata should <Bold>NEVER</Bold> be used to store any
                    identifying information about your users.
                </Paragraph>
            </Section>
        </React.Fragment>
    );
};

export default ProjectsDoc;
