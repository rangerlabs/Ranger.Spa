import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography } from '@material-ui/core';
import Footer from '../footer/Footer';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import PlanCards from './PlanCards';

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
        <React.Fragment>
            <Grid className={classes.push} container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            Pricing
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item justify="space-evenly" alignItems="center" spacing={3} xs={12} md={8}>
                    <PlanCards />
                </Grid>
            </Grid>
            <Footer />
        </React.Fragment>
    );
};

export default connect(null, { push })(Pricing);
