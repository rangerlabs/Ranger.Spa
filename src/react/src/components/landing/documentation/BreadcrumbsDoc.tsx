import React from 'react';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Introduction from './docComponents/Introduction';
import { Link as MailLink } from '@material-ui/core';

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
                    Breadcrumbs are the fuel that powers Ranger. From anywhere on any device your applications can send Breadcrumbs to Ranger's API for Ranger
                    to perform all the necessary computations to determine who, where, and when an event took place.
                </Paragraph>
                <Paragraph>
                    Ranger will be publishing further documentation on how your applications can transmit location data from any device to determine applicable
                    Geofences.
                </Paragraph>
                <Paragraph>
                    If you are interested in being a Pilot Customer of Ranger's and to learn how you can make your user's location data actionable, please
                    contact us at <MailLink href="mailto:info@rangerlabs.io">info@rangerlabs.io</MailLink>.
                </Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={BreadcrumbsDocOutline} />}
        </React.Fragment>
    );
};

export default BreadcrumbsDoc;
