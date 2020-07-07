import React from 'react';
import { Typography, createStyles, Theme, WithStyles, withStyles, Link } from '@material-ui/core';
import CentralPark from '../../../../assets/central-park.png';
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
            <Typography className={classes.blockText} variant="h3">
                Getting Started
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    At Ranger we provide hosted APIs for boundless geofencing services. Our growing list of location-centric APIs and Integrations will enable
                    you to easily implement cloud-native location services into your mobile apps.
                </Typography>
                <Typography variant="body1">This section provides a brief overview of the Ranger platform.</Typography>
            </div>
            <Typography className={classes.blockText} variant="h5">
                Unrivaled Geofencing
            </Typography>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    Ranger's easy-to-use interface allows you to easily vizualize, create, edit, and test geofences all from the same UI.
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
                    To learn more about Ranger's extensively customizable geofences, take a look at our dedicated{' '}
                    <Link href={RoutePaths.Docs.replace(':name', 'geofences')}>Geofencing</Link> documentation.
                </Typography>
            </div>

            <Typography className={classes.blockText} variant="h5">
                Flexible Integrations
            </Typography>
            <div className={classes.blockText}>
                <Typography gutterBottom variant="body1">
                    Ranger was built to be extended. Ranger currently offers Webhook integrations, but more our in the works and will be coming online shortly.
                </Typography>
                <Typography gutterBottom variant="body1">
                    What's more, all integrations are available to all subscriptions - which Integrations you choose is up to you.
                </Typography>
            </div>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    To learn more about creating and managing Integrations in Ranger, take a look at our dedicated{' '}
                    <Link href={RoutePaths.Docs.replace(':name', 'integrations')}>Integration</Link> documentation.
                </Typography>
            </div>

            <Typography className={classes.blockText} variant="h5">
                Secure Projects
            </Typography>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    Group Geofences and the Integrations they can execute into Projects. Depending on your use case, Projects could be scoped to a mobile app,
                    customer, or organizational unit.
                </Typography>
                <Typography variant="body1">Within your organization User Accounts can be scoped to specific projects.</Typography>
            </div>
            <div className={classes.blockText}>
                <Typography variant="body1">
                    To learn more about managing Projects and Project security, take a look at our dedicated{' '}
                    <Link href={RoutePaths.Docs.replace(':name', 'projects')}>Projects</Link> documentation.
                </Typography>
            </div>
        </React.Fragment>
    );
};

export default withStyles(styles)(GettingStarted);
