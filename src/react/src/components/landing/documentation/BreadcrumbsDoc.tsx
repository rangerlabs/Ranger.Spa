import React from 'react';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';
import Outline from './docComponents/Outline';
import Introduction from './docComponents/Introduction';
import { Link } from '@material-ui/core';
import HttpMethod from './textEnhancers/HttpMethod';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import DocRoutePaths from './DocRoutePaths';
import { connect } from 'react-redux';
import Bold from './textEnhancers/Bold';
import Code from './textEnhancers/Code';
import SampleRequest from './docComponents/SampleRequest';
import JsonViewer from './docComponents/JsonViewer';
import PostBreadcrumb from './json/breadcrumbs/PostBreadcrumb';

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
                    Breadcrumbs are used to track user's movements through the physical world. From anywhere on any device your applications can send
                    Breadcrumbs to Ranger's API for Ranger to perform all the necessary computations to determine who, where, and when a Geofence event took
                    place.
                </Paragraph>
                <Paragraph>
                    Breadcrumbs are sent to Ranger's API via <HttpMethod method="POST" /> requests. Once accepted into the system they are then used to
                    determine whether the user or device has interacted with one of your Geofences. Breadcrumbs are processed in the order in which they are
                    received, not by their <Code>recordedAt</Code> property.
                </Paragraph>
                <Paragraph>
                    When tracking a user, your application may optionally send metadata with Breadcrumbs. It is important to note that unlike Geofence and
                    Integration metadata, which are encrypted at rest, Breadcrumb metadata is never persisted and is only forwarded when a Geofence event gets
                    raised. <Bold>Breadcrumb metadata should never be used to send any Personally Identifying Information about your users.</Bold>
                </Paragraph>
                <Paragraph>
                    For more information on how to send Breadcrumbs to Ranger from mobile devices. See the Breadcrumbs section of the{' '}
                    <Link component="button" onClick={() => props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Api))} variant="body1">
                        API Reference
                    </Link>
                    .
                </Paragraph>
            </Introduction>
            <SampleRequest>
                <JsonViewer title="Sample Breadcrumb" json={PostBreadcrumb} expandLevel={3} />
            </SampleRequest>
            {props.showOutline && <Outline elements={BreadcrumbsDocOutline} />}
        </React.Fragment>
    );
};

export default connect(null, { push })(BreadcrumbsDoc);
