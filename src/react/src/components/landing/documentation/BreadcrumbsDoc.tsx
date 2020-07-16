import React from 'react';
import CentralPark from '../../../../assets/central-park.png';
import ProjectEdit from '../../../../assets/project-edit.png';
import WebhookSelect from '../../../../assets/webhook-select.png';
import RoutePaths from '../../RoutePaths';
import Header from './docComponents/Header';
import Block from './docComponents/Block';
import Paragraph from './docComponents/Paragraph';
import SectionHeader from './docComponents/SectionHeader';
import Image from './docComponents/Image';
import { Link } from 'react-router-dom';

const BreadcrumbsDoc = function () {
    return (
        <React.Fragment>
            <Header text="Breadcrumbs" />
            <Block>
                <Paragraph>
                    Breadcrumbs power your Geofences. We will be expanding this section to document how your devices can send Breadcrumbs to Ranger's API to
                    compute Geofence intersections and execute their configured Integrations.
                </Paragraph>
            </Block>
        </React.Fragment>
    );
};

export default BreadcrumbsDoc;
