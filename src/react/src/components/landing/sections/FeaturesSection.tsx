import React from 'react';
import { Grid, createStyles, makeStyles, Theme, Typography, Box } from '@material-ui/core';
import PlanCards from '../pricing/PlanCards';
import UnlimitedUsers from '../../../../assets/Infinite-Users.svg';
import ConfigurableGeofences from '../../../../assets/Customizable-Geofences.svg';
import MixAndMatchIntegrations from '../../../../assets/Mix-And-Match-Integrations.svg';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
        icon: {
            width: '75%',
        },
    })
);

interface FeaturesSectionProps {}

const FeaturesSection = function (props: FeaturesSectionProps) {
    const classes = useStyles(props);
    return (
        <div className={classes.layout}>
            <Grid container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography gutterBottom color="primary" align="center" variant="h4">
                            Features
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item justify="space-evenly" alignItems="flex-start" spacing={3} xs={12} md={8}>
                    <Grid item xs={7} sm={4} lg={3}>
                        <UnlimitedUsers />
                        <Typography gutterBottom color="primary" align="center" variant="h4">
                            Unlimited Users & Devices
                        </Typography>
                        <Typography color="primary" align="center" variant="h6">
                            Track as many users or devices as solution needs
                        </Typography>
                    </Grid>

                    <Grid item xs={7} sm={4} lg={3}>
                        <ConfigurableGeofences />
                        <Typography gutterBottom color="primary" align="center" variant="h4">
                            Configurable Geofences
                        </Typography>
                        <Typography color="primary" align="center" variant="h6">
                            Configure Geofences with Schedules, Metadata, Event Triggers, and Integrations
                        </Typography>
                    </Grid>

                    <Grid item xs={7} sm={4} lg={3}>
                        <MixAndMatchIntegrations />
                        <Typography gutterBottom color="primary" align="center" variant="h4">
                            Mix & Match Integrations
                        </Typography>
                        <Typography color="primary" align="center" variant="h6">
                            All Integrations are created equal - choose however many your subscription permits and watch the events fire away
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};
export default FeaturesSection;
