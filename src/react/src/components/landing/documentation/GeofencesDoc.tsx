import React from 'react';
import Header from './docComponents/Header';
import Block from './docComponents/Block';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';

export const GeofencesDocOutline = [
    {
        name: 'Geofences',
        id: 'geofences-section',
    },
] as OutlineElement[];

const ProjectsDoc = function (props: IDocProps) {
    return (
        <React.Fragment>
            <Header id="geofences-section" text="Geofences" />
            <Block>
                <Paragraph>
                    Breadcrumbs power your geofences. We will be expanding this section to document how your devices can send Breadcrumbs to Ranger's API to
                    compute geofence intersections and execute their configured Integrations.
                </Paragraph>
            </Block>
            {props.showOutline && <Outline elements={GeofencesDocOutline} />}
        </React.Fragment>
    );
};

export default ProjectsDoc;
