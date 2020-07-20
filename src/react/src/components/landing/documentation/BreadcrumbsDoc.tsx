import React from 'react';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Introduction from './docComponents/Introduction';

export const BreadcrumbsDocOutline = [
    {
        name: 'Breadcrumbs',
        id: 'breadcrumbs-section',
    },
] as OutlineElement[];

const BreadcrumbsDoc = function (props: IDocProps) {
    return (
        <React.Fragment>
            <Introduction id="breadcrumbs-section" text="Breadcrumbs">
                <Paragraph>
                    Breadcrumbs power your Geofences. We will be expanding this section to document how your devices can send Breadcrumbs to Ranger's API to
                    compute Geofence intersections and execute their configured Integrations.
                </Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={BreadcrumbsDocOutline} />}
        </React.Fragment>
    );
};

export default BreadcrumbsDoc;
