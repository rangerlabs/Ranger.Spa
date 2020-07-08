import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography } from '@material-ui/core';
import PlanCard from './PlanCard';
import { ILimitDetails } from '../../../models/app/ILimitDetails';
import Footer from '../footer/Footer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        height100: {
            height: '100%',
        },
    })
);

interface PricingProps {}

export default function Pricing(props: PricingProps) {
    const classes = useStyles(props);

    return (
        <React.Fragment>
            <Grid className={classes.height100} container direction="column">
                <Grid container item justify="center">
                    <Grid item>
                        <Typography variant="h3">Flexible Plans To Meet Your Needs</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">Enterprise plans coming soon</Typography>
                    </Grid>
                </Grid>
                <Grid container item justify="space-evenly" alignItems="center">
                    <Grid item xs={11} sm={8} md={5} lg={2}>
                        <PlanCard
                            planName="Sandbox"
                            message="Perfect for getting a feel and testing your integrations"
                            limitDetails={{ geofences: 100, accounts: 1, integrations: 2, projects: 1 } as ILimitDetails}
                            cost="FREE"
                        />
                    </Grid>
                    <Grid item xs={11} sm={8} md={5} lg={2}>
                        <PlanCard
                            planName="Startup"
                            message="When you're ready to start scaling and adding integrations"
                            limitDetails={{ geofences: 1000, accounts: 3, integrations: 3, projects: 1 } as ILimitDetails}
                            cost="$49 / Month"
                        />
                    </Grid>
                    <Grid item xs={11} sm={8} md={5} lg={2}>
                        <PlanCard
                            planName="Pro"
                            message="Extend your reach with 5,000 geofences and 5 integrations"
                            limitDetails={{ geofences: 5000, accounts: 5, integrations: 5, projects: 1 } as ILimitDetails}
                            cost="$99 / Month"
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Footer />
        </React.Fragment>
    );
}
