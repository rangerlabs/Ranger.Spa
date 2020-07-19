import React from 'react';
import Header from './docComponents/Header';
import Block from './docComponents/Block';
import Paragraph from './docComponents/Paragraph';
import { OutlineElement } from './docComponents/OutlineElement';

export const BreadcrumbsDocOutline = [
    {
        name: 'Breadcrumbs',
        id: 'breadcrumbs-section',
    },
] as OutlineElement[];

const BreadcrumbsDoc = function (props: IDocProps) {
    const { outline: OutlineElement } = props;
    return (
        <React.Fragment>
            <Header id="breadcrumbs-section" text="Breadcrumbs" />
            <Block>
                <Paragraph>
                    Breadcrumbs power your Geofences. We will be expanding this section to document how your devices can send Breadcrumbs to Ranger's API to
                    compute Geofence intersections and execute their configured Integrations.
                </Paragraph>
            </Block>
            <OutlineElement />
        </React.Fragment>
    );
};

export default BreadcrumbsDoc;
