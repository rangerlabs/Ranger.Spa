import { OutlineElement } from '../docComponents/OutlineElement';
import React from 'react';
import Introduction from '../docComponents/Introduction';
import Paragraph from '../docComponents/Paragraph';
import Outline from '../docComponents/Outline';
import Section from '../docComponents/Section';

export const ApiDocOutline = [
    {
        name: 'Api',
        id: 'api-section',
    },
    {
        name: 'API Keys',
        id: 'api-keys-section',
    },
    {
        name: 'Versioning',
        id: 'versioning-section',
    },
    {
        name: 'Responses',
        id: 'responses-section',
    },
] as OutlineElement[];

export default function ApiDoc(props: IDocProps) {
    return (
        <React.Fragment>
            <Introduction id="api-section" text="Geofences">
                <Paragraph></Paragraph>
                <Paragraph>
                    Ranger supports Geofences of any size and in nearly any configuration including Circular Geofences, Polygon Geofences, and Geofences which
                    overlap with one another. The easy-to-use Geofencing UI allows you to vizualize, create, and edit all of your Geofences in a single view.
                </Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={ApiDocOutline} />}
            <Section text="Api Keys" id="api-keys-section">
                <Paragraph>
                    To get started creating Geofences, select the Map option from the main navigation. You can quickly navigate to the location of where the
                    Geofence must be placed by using the search bar. Once you have arrived at the location of the Geofence, hover over the Speed Dial icon to
                    select the shape of the Geofence. Once a shape has been selected, you will see Cancel and Save options become present. You can cancel the
                    creation of a Geofence at anytime.
                </Paragraph>
            </Section>
            <Section text="Versioning" id="versioning-section">
                <Paragraph>
                    To get started creating Geofences, select the Map option from the main navigation. You can quickly navigate to the location of where the
                    Geofence must be placed by using the search bar. Once you have arrived at the location of the Geofence, hover over the Speed Dial icon to
                    select the shape of the Geofence. Once a shape has been selected, you will see Cancel and Save options become present. You can cancel the
                    creation of a Geofence at anytime.
                </Paragraph>
            </Section>
            <Section text="Responses" id="responses-section">
                <Paragraph>
                    To get started creating Geofences, select the Map option from the main navigation. You can quickly navigate to the location of where the
                    Geofence must be placed by using the search bar. Once you have arrived at the location of the Geofence, hover over the Speed Dial icon to
                    select the shape of the Geofence. Once a shape has been selected, you will see Cancel and Save options become present. You can cancel the
                    creation of a Geofence at anytime.
                </Paragraph>
            </Section>
        </React.Fragment>
    );
}
