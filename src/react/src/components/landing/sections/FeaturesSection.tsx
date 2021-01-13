import React from 'react';
import { Grid, createStyles, makeStyles, Theme, Typography, Box, useMediaQuery, useTheme } from '@material-ui/core';
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
            width: '30%',
        },
        iconContainer: {
            textAlign: 'left',
        },
    })
);

interface FeaturesSectionProps {}

const FeaturesSection = function (props: FeaturesSectionProps) {
    const classes = useStyles(props);
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <div className={classes.layout}>
            <Grid container direction="column" alignItems="center" spacing={7}>
                <Grid container item justify="space-evenly" alignItems="flex-start" spacing={3} xs={12} md={8}>
                    <Grid className={classes.iconContainer} item xs={7} sm={4} lg={3}>
                        <UnlimitedUsers className={classes.icon} />
                        <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                            Unlimited Users & Devices
                        </Typography>
                        <Typography color="primary" align="left" variant="subtitle1">
                            Track as many users and devices as your product supports
                        </Typography>
                    </Grid>

                    <Grid className={classes.iconContainer} item xs={7} sm={4} lg={3}>
                        <ConfigurableGeofences className={classes.icon} />
                        <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                            Configurable Geofences
                        </Typography>
                        <Typography color="primary" align="left" variant="subtitle1">
                            Configure Geofences with Schedules, Metadata, Event Triggers, and Integrations
                        </Typography>
                    </Grid>

                    <Grid className={classes.iconContainer} item xs={7} sm={4} lg={3}>
                        <MixAndMatchIntegrations className={classes.icon} />
                        <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                            Mix & Match Integrations
                        </Typography>
                        <Typography color="primary" align="left" variant="subtitle1">
                            Configure Integrations to execute for all Geofences or individual Geofences
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};
export default FeaturesSection;
