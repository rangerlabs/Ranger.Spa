import React from 'react';
import { Grid, createStyles, makeStyles, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import AxisArrow from 'mdi-material-ui/AxisArrow';
import StoreOutline from 'mdi-material-ui/StoreOutline';
import TruckOutline from 'mdi-material-ui/TruckOutline';
import GoogleController from 'mdi-material-ui/GoogleController';
import WalletTravel from 'mdi-material-ui/WalletTravel';
import Infinity from 'mdi-material-ui/Infinity';

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
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
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
                        <Grid container className={classes.container} item xs={10} sm={4} lg={4}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item>
                                    <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                                        IoT
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <AxisArrow />
                                </Grid>
                            </Grid>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Trigger actions across devices at specified locations
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={10} sm={4} lg={4}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item>
                                    <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                                        Retail
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <StoreOutline />
                                </Grid>
                            </Grid>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Sieze the moment. Push rewards and discounts to nearby customers or track visits to competitors
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={10} sm={4} lg={4}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item>
                                    <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                                        Freight
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <TruckOutline />
                                </Grid>
                            </Grid>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Disperse payment, verify load delivery, and keep operators informed
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={10} sm={4} lg={4}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item>
                                    <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                                        Gaming
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <GoogleController />
                                </Grid>
                            </Grid>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Initiate in-game rewards, alerts, and actions at real world locations
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={10} sm={4} lg={4}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item>
                                    <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                                        Travel
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <WalletTravel />
                                </Grid>
                            </Grid>
                            <Typography color="primary" align="left" variant="subtitle1">
                                Make travel apps interactive with nearby travel tips, gamification, and new visitor rewards
                            </Typography>
                        </Grid>
                        <Grid className={classes.container} item xs={10} sm={4} lg={4}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item>
                                    <Typography gutterBottom color="primary" align={isMdDown ? 'center' : 'left'} variant="h5">
                                        Endless use cases
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Infinity />
                                </Grid>
                            </Grid>
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
