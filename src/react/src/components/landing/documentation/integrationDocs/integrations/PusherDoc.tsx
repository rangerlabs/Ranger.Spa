import React from 'react';
import NewPusherIntegration from '../../../../../../assets/new-pusher-integration.png';
import Section from '../../docComponents/Section';
import Paragraph from '../../docComponents/Paragraph';
import Image from '../../docComponents/Image';
import PusherResult from '../../json/integrations/PusherResult';
import JsonViewer from '../../docComponents/JsonViewer';
import Bold from '../../textEnhancers/Bold';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

interface PusherProps {
    push: typeof push;
}

const PusherDoc = function (props: PusherProps) {
    return (
        <Section text="Pusher" id="pusher-section">
            <Paragraph>Ranger's Pusher Integration enables you to forward geofence events back to the device that raised the event.</Paragraph>
            <Paragraph>
                To begin receiving forwarding Geofence events back to the device which raised them, Select 'New' on the integrations page and select the
                'Pusher' Integration type. You will be prompted to configure your Pusher Channels account.
            </Paragraph>
            <Paragraph>
                Devices which send Breadcrumbs to Ranger can subscribe to a predefined Pusher Channel using the credentials you have provided for your Pusher
                Channels account. When a Geofence event is raised, it will be published to the following channel name: <Bold>ranger-&#123;device_id&#125;</Bold>
                , where the <Bold>device_id</Bold> is the unique Device Id used to send the Breadcrumb. The event name to subscribe to is{' '}
                <Bold>ranger-geofence-event</Bold>.
            </Paragraph>
            <Paragraph>The following is an example of a typical Pusher Channels payload.</Paragraph>
            <Image src={NewPusherIntegration} alt="New Pusher Integration" maxWidth={60} />
            <Paragraph>
                Pusher Integrations also permit Metadata key-value pairs to be configured and are encrypted at rest. Metadata appear in the Pusher event body
                and can be useful to transfer data whenever the Integration is executed. Duplicate keys are permitted.
            </Paragraph>
            <Paragraph>Please note, Ranger is not responsible for charges incurred using the Pusher Channels integration.</Paragraph>
            <JsonViewer title={'Pusher Channels Event Payload'} json={PusherResult} />
        </Section>
    );
};

export default connect(null, { push })(PusherDoc);
