import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import CentralPark from '../../../../assets/central-park.png';
import Breadcrumbs from '../../../../assets/breadcrumbs.png';

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
            <Typography className={classes.blockText} variant="h5">
                Getting Started with Ranger
            </Typography>
            <Typography className={classes.blockText} variant="body1">
                Welcome to Ranger. At Ranger, we provide hosted APIs for boundless geofencing services. Our growing list of location-centric APIs and
                Integrations will enable you and your organization to easily implement cloud-native location services into your mobile apps.
            </Typography>
            <Typography className={classes.blockText} variant="h5" gutterBottom>
                Unrivaled Geofencing
            </Typography>
            <Typography className={classes.blockText} variant="body1">
                Geofences are virtual boundaries around physical locations - and Ranger's geofencing solution provides unrivaled functionality.
            </Typography>
            <Typography className={classes.blockText} variant="body1">
                Ranger's easy-to-use interface for creating geofences allows you to quickly visualize where geofences are in relation to one another and whether
                they overlap with existing geofences.
            </Typography>
            <div className={classes.imgContainer}>
                <img style={{ maxWidth: '70%' }} src={CentralPark} alt="central-park-geofence" />
            </div>
            <Typography className={classes.blockText} variant="body1">
                Furthermore, the Ranger platform enables you to customize what events get triggered and where those events go - all on a per geofence basis.
            </Typography>
            <Typography className={classes.blockText} variant="body1">
                Do you want to collect Analytics for all geofences but send Marketing material for only a subset of your geofences? Ranger has all that handled
                and more.
            </Typography>
            <Typography className={classes.blockText} variant="body1">
                To learn more about Ranger's extensively customizable geofences, take a look at our section dedicated to Geofencing.
            </Typography>
            <Typography className={classes.blockText} variant="h5" gutterBottom>
                Breadcrumbs
            </Typography>
            <Typography className={classes.blockText} variant="body1">
                Breadcrumbs are the foundation of Ranger. The Ranger API ingests Breadcrumbs from devices running your mobile app and uses the trail of
                Breadcrumbs to compute whether the device or user has Entered, is Dwelling, or has Exited any combination geofences.
            </Typography>
            <div className={classes.imgContainer}>
                <img style={{ maxWidth: '50%' }} src={Breadcrumbs} alt="breadcrumbs" />
            </div>
            <Typography className={classes.blockText} variant="body1">
                To learn more about how to start sending Breadcrumbs to Ranger, check-out our section all about Breadcrumbs.
            </Typography>
        </React.Fragment>
    );
};

export default withStyles(styles)(GettingStarted);
