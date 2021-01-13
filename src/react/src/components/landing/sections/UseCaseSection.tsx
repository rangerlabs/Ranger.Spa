import React from 'react';
import { Grid, createStyles, makeStyles, Theme, Typography, Box, useMediaQuery, useTheme } from '@material-ui/core';
import UnlimitedUsers from '../../../../assets/Infinite-Users.svg';
import MixAndMatchIntegrations from '../../../../assets/Mix-And-Match-Integrations.svg';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
        container: {
            textAlign: 'left',
        },
    })
);

interface UseCaseSectionProps {}

const UseCaseSection = function (props: UseCaseSectionProps) {
    const classes = useStyles(props);
    return (
        <div className={classes.layout}>
            <Grid container alignContent="center" justify="center" spacing={5}>
                <Grid item xs={12}>
                    <Typography gutterBottom color="primary" align="center" variant="h4">
                        Use Cases For Every Industry
                    </Typography>
                </Grid>
                <Grid container direction="column" alignItems="center" spacing={7}>
                    <Grid container item justify="space-evenly" alignItems="flex-start" spacing={3} xs={12} md={8}>
                        <Grid className={classes.container} item xs={7} sm={4} lg={3}>
                            <Typography gutterBottom color="primary" align="left" variant="h5">
                                IoT
                            </Typography>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Trigger actions across devices at specified locations
                            </Typography>
                        </Grid>

                        <Grid className={classes.container} item xs={7} sm={4} lg={3}>
                            <Typography gutterBottom color="primary" align="left" variant="h5">
                                Retail
                            </Typography>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Sieze the moment. Push rewards and discounts to nearby customers or track visits to competitors
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={7} sm={4} lg={3}>
                            <Typography gutterBottom color="primary" align="left" variant="h5">
                                Freight
                            </Typography>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Disperse payment, verify load delivery, and keep operators informed
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={7} sm={4} lg={3}>
                            <Typography gutterBottom color="primary" align="left" variant="h5">
                                Gaming
                            </Typography>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Initiate in-game rewards, alerts, and actions at real world locations
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={7} sm={4} lg={3}>
                            <Typography gutterBottom color="primary" align="left" variant="h5">
                                Travel
                            </Typography>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Make travel apps interactive with nearby travel tips, gamification, and new visitor rewards
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={7} sm={4} lg={3}>
                            <Typography gutterBottom color="primary" align="left" variant="h5">
                                Endless use cases
                            </Typography>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Drive action on any platform for any user base at any real world location
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};
export default UseCaseSection;
