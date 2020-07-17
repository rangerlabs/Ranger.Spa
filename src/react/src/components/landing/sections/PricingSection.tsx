import React from 'react';
import { Grid, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import PlanCards from '../pricing/PlanCards';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        padding: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
        typography: {
            color: theme.palette.primary.main,
        },
    })
);

interface PricingSectionProps {}

const PricingSection = function (props: PricingSectionProps) {
    const classes = useStyles(props);
    return (
        <div className={classes.padding}>
            <Grid container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography className={classes.typography} align="center" variant="h4">
                            Easy To Manage Subscription Pricing
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item justify="space-evenly" alignItems="center" spacing={3} xs={12} md={8}>
                    <PlanCards />
                </Grid>
            </Grid>
        </div>
    );
};
export default PricingSection;
