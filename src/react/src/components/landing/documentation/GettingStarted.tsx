import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import CentralPark from '../../../../assets/central-park.png';
import Breadcrumbs from '../../../../assets/breadcrumbs.png';
import HttpMethod from './TextEnhancers/HttpMethod';

const styles = (theme: Theme) =>
    createStyles({
        blockText: {
            marginBottom: theme.spacing(3),
        },
        imgContainer: {
            textAlign: 'center',
            marginBottom: theme.spacing(3),
        },
    });

interface GettingStartedProps extends WithStyles<typeof styles> {}

const GettingStarted = function (props: GettingStartedProps) {
    const { classes } = props;
    return (
        <React.Fragment>
            <Typography className={classes.blockText} variant="h4">
                Getting Started with Ranger
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Welcome to Ranger. At Ranger, we provide hosted APIs for boundless geofencing services. Our growing list of location-centric APIs and
                    Integrations will enable you and your organization to easily implement cloud-native location services into your mobile apps.
                </Typography>
                <Typography variant="body1">
                    This section provides a brief overview of the Ranger platform. For a more detailed understanding of each topic, follow the links on the
                    left.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h4">
                Unrivaled Geofencing
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Geofences are virtual boundaries around physical locations - and Ranger's geofencing solution provides unrivaled functionality.
                </Typography>
                <Typography variant="body1">
                    Ranger's easy-to-use interface for creating geofences allows you to quickly visualize where geofences are in relation to one another and
                    whether they overlap with existing geofences.
                </Typography>
            </div>
            <div className={classes.imgContainer}>
                <img style={{ maxWidth: '70%' }} src={CentralPark} alt="central-park-geofence" />
            </div>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Furthermore, the Ranger platform enables you to customize what events get triggered and where those events go - all on a per geofence basis.
                </Typography>
                <Typography gutterBottom variant="body1">
                    Do you want to collect Analytics for all geofences but send Marketing material for only a subset of your geofences? Ranger has all that
                    handled and more.
                </Typography>
                <Typography variant="body1">
                    To learn more about Ranger's extensively customizable geofences, take a look at our section dedicated to Geofencing.
                </Typography>
            </div>

            <Typography className={classes.blockText} variant="h4">
                Integrations
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    This is some API text <HttpMethod method="GET" />
                    <HttpMethod method="POST" />
                    <HttpMethod method="PUT" />
                    <HttpMethod method="DELETE" />
                </Typography>
            </div>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    To learn more about managing Projects and Project security, visit the Project section of our documentation.
                </Typography>
            </div>

            <Typography className={classes.blockText} variant="h4">
                Projects
            </Typography>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    Projects are how Ranger groups Geofences and the Integrations they can execute. Additionally, each Project has its own unique API keys.
                    Depending on your use case, Projects could be scoped to a mobile app, customer, or organizational unit.
                </Typography>
            </div>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    To learn more about managing Projects and Project security, visit the Project section of our documentation.
                </Typography>
            </div>
        </React.Fragment>
    );
};

export default withStyles(styles)(GettingStarted);
