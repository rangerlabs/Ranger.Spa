import React from 'react';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Introduction from './docComponents/Introduction';
import { Link as MailLink, Link } from '@material-ui/core';
import HttpMethod from './textEnhancers/HttpMethod';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import DocRoutePaths from './DocRoutePaths';
import { connect } from 'react-redux';

export const BreadcrumbsDocOutline = [
    {
        name: 'Breadcrumbs',
        id: 'breadcrumbs-section',
    },
] as OutlineElement[];

interface BreadcrumbsDocProps extends IDocProps {
    push: typeof push;
}

const BreadcrumbsDoc = function (props: BreadcrumbsDocProps) {
    return (
        <React.Fragment>
            <Introduction id="breadcrumbs-section" text="Breadcrumbs">
                <Paragraph>
                    Breadcrumbs are the resource that powers Ranger. From anywhere on any device your applications can send Breadcrumbs to Ranger's API for
                    Ranger to perform all the necessary computations to determine who, where, and when an event took place.
                </Paragraph>
                <Paragraph>
                    Breadcrumbs are sent to Ranger's API via <HttpMethod method="POST" /> requests. Once accepted into the system they are then used to
                    determine whether the user or device has interacted with one of your Geofences.
                </Paragraph>
                <Paragraph>
                    For more information on how to send Breadcrumbs to Ranger from mobile devices. See the Breadcrumbs section of the{' '}
                    <Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Api))} variant="body1">
                        API Reference
                    </Link>
                    .
                </Paragraph>
            </Introduction>
            {props.showOutline && <Outline elements={BreadcrumbsDocOutline} />}
        </React.Fragment>
    );
};

export default connect(null, { push })(BreadcrumbsDoc);
