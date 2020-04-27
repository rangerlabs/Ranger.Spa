import React, { Component } from 'react';
import PlanCard from './PlanCard';
import { Grid, Theme, createStyles, WithStyles, withStyles, Paper, Typography } from '@material-ui/core';
import SubscriptionsService from '../../../services/SubscriptionsService';
const subscriptionsService = new SubscriptionsService();

const styles = (theme: Theme) =>
    createStyles({
        push: {
            marginTop: '10%',
        },
        currentSubscription: {
            width: '80%',
            height: '50px',
        },
    });

interface SubscriptionProps extends WithStyles<typeof styles> {}

interface SubscriptionState {
    cbInstance: any;
    loading: boolean;
    errorMsg: string;
}

class Subscription extends React.Component<SubscriptionProps, SubscriptionState> {
    constructor(props: SubscriptionProps) {
        super(props);
        this.state = {
            cbInstance: window.Chargebee.init({
                site: 'rangerlabs-test',
            }),
            loading: false,
            errorMsg: '',
        };
    }

    upgrade(planId: string) {
        this.setState({ loading: true });
        this.state.cbInstance.openCheckout({
            hostedPage: () => {
                return subscriptionsService.getCheckoutExistingHostedPageUrl(planId).then((response) => response.result);
            },
            success(hostedPageId: string) {
                console.log(hostedPageId);
            },
            close: () => {
                this.setState({ loading: false });
                console.log('checkout new closed');
            },
            step(step: string) {
                console.log('checkout', step);
            },
        });
        event.preventDefault();
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Grid className={classes.push} container justify="space-evenly" alignItems="center">
                    <Grid item xs={12} sm={8} md={4} lg={2}>
                        <PlanCard planId="sandbox" planName="Sandbox" cost="FREE" onUpgrade={this.upgrade.bind(this)} />
                    </Grid>
                    <Grid item xs={12} sm={8} md={4} lg={2}>
                        <PlanCard planId="startup" planName="Startup" cost="$49 / Month" onUpgrade={this.upgrade.bind(this)} />
                    </Grid>
                    <Grid item xs={12} sm={8} md={4} lg={2}>
                        <PlanCard planId="pro" planName="Pro" cost="$99 / Month" onUpgrade={this.upgrade.bind(this)} />
                    </Grid>
                </Grid>
                <Paper className={classes.currentSubscription} elevation={3}>
                    <Typography variant="h5">Your current subscription</Typography>
                </Paper>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Subscription);
