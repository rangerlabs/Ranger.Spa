import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import Header from './docComponents/Header';
import Block from './docComponents/Block';
import Paragraph from './docComponents/Paragraph';

const ProjectsDoc = function () {
    return (
        <React.Fragment>
            <Header text="Geofences" />
            <Block>
                <Paragraph>
                    Breadcrumbs power your geofences. We will be expanding this section to document how your devices can send Breadcrumbs to Ranger's API to
                    compute geofence intersections and execute their configured Integrations.
                </Paragraph>
            </Block>{' '}
        </React.Fragment>
    );
};

export default ProjectsDoc;
