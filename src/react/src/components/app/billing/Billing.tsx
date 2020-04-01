import React, { Component } from 'react';
import PlanCard from './PlanCard';
import { Grid, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import SubscriptionsService from '../../../services/SubscriptionsService';
const subscriptionsService = new SubscriptionsService();

const styles = (theme: Theme) =>
    createStyles({
        push: {
            marginTop: '10%',
        },
    });

interface BillingProps extends WithStyles<typeof styles> {}

interface BillingState {
    cbInstance: any;
    loading: boolean;
    errorMsg: string;
}

class Billing extends React.Component<BillingProps, BillingState> {
    constructor(props: BillingProps) {
        super(props);
        this.state = {
            cbInstance: window.Chargebee.init({
                site: 'rangerlabs-test',
            }),
            loading: false,
            errorMsg: '',
        };
        this.upgrade = this.upgrade.bind(this);
    }
    upgrade(planId: string) {
        this.setState({ loading: true });
        this.state.cbInstance.openCheckout({
            hostedPage: () => {
                return subscriptionsService.getCheckoutExistingHostedPageUrl(planId).then(response => response.content);
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
            <Grid className={classes.push} container justify="space-evenly" alignItems="center">
                <Grid item xs={12} sm={8} md={4} lg={2}>
                    <PlanCard planId="sandbox" planName="Sandbox" cost="FREE" onUpgrade={this.upgrade} />
                </Grid>
                <Grid item xs={12} sm={8} md={4} lg={2}>
                    <PlanCard planId="startup" planName="Startup" cost="$49 / Month" onUpgrade={this.upgrade} />
                </Grid>
                <Grid item xs={12} sm={8} md={4} lg={2}>
                    <PlanCard planId="pro" planName="Pro" cost="$99 / Month" onUpgrade={this.upgrade} />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Billing);
