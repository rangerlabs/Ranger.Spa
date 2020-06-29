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
            <Typography className={classes.blockText} variant="h3">
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
            <Typography className={classes.blockText} variant="h3" gutterBottom>
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
            <Typography className={classes.blockText} variant="h3" gutterBottom>
                Breadcrumbs
            </Typography>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    Breadcrumbs are the foundation of Ranger. The Ranger API ingests Breadcrumbs from devices running your mobile app and uses the trail of
                    Breadcrumbs to compute whether the device or user has Entered, is Dwelling, or has Exited any combination geofences.
                </Typography>
            </div>
            <div className={classes.imgContainer}>
                <img style={{ maxWidth: '50%' }} src={Breadcrumbs} alt="breadcrumbs" />
            </div>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    To learn more about how to start sending Breadcrumbs to Ranger, check-out our section all about Breadcrumbs in the API documentation.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h3" gutterBottom>
                Projects
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Projects are how Ranger groups Geofences and the Integrations they can execute. Additionally, each Project has its own unique API keys to
                    associate with a mobile app. Depending on your use case, Projects could be scoped to a mobile app, customer, or organizational unit.
                </Typography>
                <Typography gutterBottom variant="body1">
                    Each Project is assigned a pair of unique API keys that enable your Breadcrumb requsts to indicate to Ranger whether it must execute LIVE or
                    TEST Integrations. A third API key can be used to create and manage Geofence resources.
                </Typography>
                <Typography variant="body1">
                    Projects can be disabled without the need for being deleted and API keys can be re-generated should the need arise.
                </Typography>
            </div>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    To learn more about managing Projects and Project security, visit the Project section of our documentation.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h3" gutterBottom>
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
        </React.Fragment>
    );
};

export default withStyles(styles)(GettingStarted);
