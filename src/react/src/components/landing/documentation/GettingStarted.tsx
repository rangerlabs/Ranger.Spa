import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import CentralPark from '../../../../assets/central-park.png';
import Breadcrumbs from '../../../../assets/breadcrumbs.png';
import HttpMethod from './TextEnhancers/HttpMethod';
import { Link } from 'react-router-dom';
import RoutePaths from '../../RoutePaths';

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
                    At Ranger we provide hosted APIs for boundless geofencing services. Our growing list of location-centric APIs and Integrations will enable
                    you to easily implement cloud-native location services into your mobile apps.
                </Typography>
                <Typography variant="body1">
                    This section provides a brief overview of the Ranger platform. Navigate to a specific top to learn more.
                </Typography>
            </div>
            <Typography className={classes.blockText} variant="h5">
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
                    Create custom geofence schedules, add unique metadata, configure which events get triggered, and where those events get sent - all on a per
                    geofence basis.
                </Typography>
                <Typography variant="body1">
                    To learn more about Ranger's extensively customizable geofences, take a look at our dedicated
                    <Link to={RoutePaths.Docs.replace(':name', 'geofences')}> Geofencing</Link> documentation.
                </Typography>
            </div>

            <Typography className={classes.blockText} variant="h5">
                Integrations
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Ranger was built to be extended. Know when a user or device is interacting with one of your geofences by sending the result of the
                    interaction to a REST endpoint of your choosing. Ranger currently offers WebHooks as our sole integration, but more our in the works and
                    will be coming online shortly.
                </Typography>
                <Typography gutterBottom variant="body1">
                    And what's more, which Integrations you choose for your subscription is entirely up to you.
                </Typography>
            </div>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    To learn more about creating and managing Integrations in Ranger, take a look at our dedicated
                    <Link to={RoutePaths.Docs.replace(':name', 'integrations')}> Integration</Link> documentation.
                </Typography>
            </div>

            <Typography className={classes.blockText} variant="h5">
                Projects
            </Typography>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    Projects are how Ranger groups Geofences and the Integrations they can execute. Additionally, each Project has its own unique API keys.
                    Depending on your use case, Projects could be scoped to a mobile app, customer, or organizational unit.
                </Typography>
                <Typography variant="body1">
                    Within your organization, User Accounts can be created and scoped to specific projects to manage the Geofences within that Project.
                </Typography>
            </div>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    To learn more about managing Projects and Project security, take a look at our dedicated
                    <Link to={RoutePaths.Docs.replace(':name', 'projects')}> Projects</Link> documentation.
                </Typography>
            </div>
        </React.Fragment>
    );
};

export default withStyles(styles)(GettingStarted);
