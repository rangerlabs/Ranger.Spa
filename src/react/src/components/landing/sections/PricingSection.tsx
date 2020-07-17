import React from 'react';
import { Grid, createStyles, makeStyles, Theme } from '@material-ui/core';
import PlanCards from '../pricing/PlanCards';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            marginTop: theme.spacing(8),
            marginBottom: theme.spacing(8),
        },
    })
);

interface PricingSectionProps {}

const PricingSection = function (props: PricingSectionProps) {
    const classes = useStyles(props);
    return (
        <div className={classes.margin}>
            <Grid container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="space-evenly" alignItems="center" spacing={3} xs={12} md={8}>
                    <PlanCards />
                </Grid>
            </Grid>
        </div>
    );
};
export default PricingSection;
