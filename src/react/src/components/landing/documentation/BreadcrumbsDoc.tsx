import React from 'react';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Introduction from './docComponents/Introduction';
import { Link as MailLink } from '@material-ui/core';
import HttpMethod from './textEnhancers/HttpMethod';

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
                    Breadcrumbs are sent to Ranger's API via <HttpMethod method="POST" /> requests. Once accepted into the system they are then used to
                    determine whether the user or device has interacted with one of your Geofences.
                </Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={BreadcrumbsDocOutline} />}
        </React.Fragment>
    );
};

export default BreadcrumbsDoc;
