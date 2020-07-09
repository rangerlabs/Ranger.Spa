import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Container, Button } from '@material-ui/core';
import PlanCard from './PlanCard';
import { ILimitDetails } from '../../../models/app/ILimitDetails';
import Footer from '../footer/Footer';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        push: {
            paddingTop: '3%',
        },
        signUp: {
            background: theme.palette.primary.main,
            marginTop: `${theme.spacing(5)}px !important`,
        },
        trialButton: {
            minWidth: '25%',
            margin: theme.spacing(4),
            color: theme.palette.common.white,
            '&:hover': {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
            },
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.palette.common.white,
        },
        child: {
            backgroundColor: theme.palette.primary.main,
        },
    })
);

interface PricingProps {
    push: typeof push;
}

const Pricing = function (props: PricingProps) {
    const classes = useStyles(props);

    return (
        <div>
            <Grid className={classes.push} container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            Pricing
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item justify="space-evenly" alignItems="center" spacing={3} xs={12} md={8}>
                    <Grid item xs={11} sm={8} md={5} lg={3}>
                        <PlanCard
                            planName="Sandbox"
                            message="Perfect for getting a feel and testing your integrations"
                            limitDetails={{ geofences: 100, accounts: 1, integrations: 2, projects: 1 } as ILimitDetails}
                            cost="FREE"
                        />
                    </Grid>
                    <Grid item xs={11} sm={8} md={5} lg={3}>
                        <PlanCard
                            planName="Startup"
                            message="When you're ready to start scaling and adding integrations"
                            limitDetails={{ geofences: 1000, accounts: 3, integrations: 3, projects: 1 } as ILimitDetails}
                            cost="$49 / Month"
                        />
                    </Grid>
                    <Grid item xs={11} sm={8} md={5} lg={3}>
                        <PlanCard
                            planName="Pro"
                            message="Extend your reach with 5,000 geofences and 5 integrations"
                            limitDetails={{ geofences: 5000, accounts: 5, integrations: 5, projects: 1 } as ILimitDetails}
                            cost="$99 / Month"
                        />
                    </Grid>
                    <Grid item xs={11} sm={8} md={5} lg={3}>
                        <PlanCard
                            planName="Enterprise"
                            message="Enterprise plans coming soon"
                            limitDetails={{ geofences: 0, accounts: 0, integrations: 0, projects: 0 } as ILimitDetails}
                            cost="$--- / Month"
                        />
                    </Grid>
                </Grid>
                <Grid className={classes.signUp} container item justify="center" xs={12}>
                    <Button
                        TouchRippleProps={{ classes: { child: classes.child } }}
                        className={classes.trialButton}
                        onClick={() => props.push(RoutePaths.SignUp)}
                        variant="outlined"
                    >
                        START FOR FREE TODAY
                    </Button>
                </Grid>
            </Grid>
            <Footer />
        </div>
    );
};

export default connect(null, { push })(Pricing);
