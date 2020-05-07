import React, { Component } from 'react';
import PlanCard from './PlanCard';
import { Grid, Theme, createStyles, WithStyles, withStyles, Paper, Typography, Box, Link } from '@material-ui/core';
import SubscriptionsService from '../../../services/SubscriptionsService';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import ISubscriptionLimitDetails from '../../../models/app/ISubscriptionLimitDetails';
import populateSubscriptionLimitDataHOC from '../hocs/PopulateSubscriptionLimitDataHOC';
import { titleCase } from 'change-case';
import RoutePaths from '../../RoutePaths';
const subscriptionsService = new SubscriptionsService();

const styles = (theme: Theme) =>
    createStyles({
        push: {
            marginTop: '10%',
        },
        currentSubscription: {
            width: '100%',
            backgroundColor: theme.palette.common.white,
            padding: theme.spacing(2),
        },
        downgradeWarning: {
            width: '100%',
            backgroundColor: theme.palette.common.white,
            padding: theme.spacing(1),
        },
        columnRoot: {
            height: '100%',
        },
    });

interface SubscriptionProps extends WithStyles<typeof styles> {
    subscriptionLimitDetails: ISubscriptionLimitDetails;
}

interface SubscriptionState {
    cbInstance: any;
    loading: boolean;
    errorMsg: string;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        subscriptionLimitDetails: state.subscriptionLimitDetailsState.subscriptionLimitDetails,
    };
};

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
            hostedPage: async () => {
                return new Promise(async (resolve, reject) => {
                    const result = await subscriptionsService.getCheckoutExistingHostedPageUrl(planId);
                    const hostedPage = {
                        id: result.result.id,
                        type: result.result.type,
                        url: result.result.url,
                        state: result.result.state,
                        embed: result.result.embed,
                        created_at: result.result.createdAt,
                        expires_at: result.result.expiresAt,
                    };
                    resolve(hostedPage);
                });
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

    isLimitReached = (utilized: number, limit: number): boolean => utilized === limit;
    isNearingLimit = (utilized: number, limit: number): boolean => utilized / limit >= 0.9 || utilized + 1 === limit;
    isCurrentPlan = (planId: string): boolean => planId === this.props.subscriptionLimitDetails.planId;

    render() {
        const { classes } = this.props;
        const { utilized, limit } = this.props.subscriptionLimitDetails;
        return (
            <Box height="100%">
                <Grid className={classes.columnRoot} direction="column" container justify="space-evenly" alignItems="center">
                    <Grid direction="row" container item justify="space-evenly" alignItems="center">
                        <Grid item xs={11} sm={8} md={5} lg={2}>
                            <PlanCard
                                isCurrentPlan={this.isCurrentPlan('sandbox')}
                                planId="sandbox"
                                planName="Sandbox"
                                limitDetails={this.props.subscriptionLimitDetails.limit}
                                cost="FREE"
                                onUpgrade={this.upgrade.bind(this)}
                            />
                        </Grid>
                        <Grid item xs={11} sm={8} md={5} lg={2}>
                            <PlanCard
                                isCurrentPlan={this.isCurrentPlan('startup')}
                                planId="startup"
                                planName="Startup"
                                limitDetails={this.props.subscriptionLimitDetails.limit}
                                cost="$49 / Month"
                                onUpgrade={this.upgrade.bind(this)}
                            />
                        </Grid>
                        <Grid item xs={11} sm={8} md={5} lg={2}>
                            <PlanCard
                                isCurrentPlan={this.isCurrentPlan('pro')}
                                planId="pro"
                                planName="Pro"
                                limitDetails={this.props.subscriptionLimitDetails.limit}
                                cost="$99 / Month"
                                onUpgrade={this.upgrade.bind(this)}
                            />
                        </Grid>
                    </Grid>
                    <Grid direction="row" container item justify="center">
                        <Grid item xs={10} md={11}>
                            <Paper className={classes.currentSubscription} elevation={3}>
                                <Typography align="center" variant="h6">
                                    Current subscription
                                </Typography>
                                <Typography align="center" color="primary" variant="h6">
                                    {titleCase(this.props.subscriptionLimitDetails.planId)}
                                </Typography>

                                <Grid container justify="space-around">
                                    <Grid item alignContent="center">
                                        <Typography variant="subtitle1">Geofences</Typography>
                                        {this.isNearingLimit(utilized.geofences, limit.geofences) ? (
                                            <Typography align="center" color="error" variant="subtitle1">
                                                {utilized.geofences}/{limit.geofences}
                                            </Typography>
                                        ) : (
                                            <Typography align="center" color="primary" variant="subtitle1">
                                                {utilized.geofences}/{limit.geofences}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid direction="column" item alignItems="center">
                                        <Typography variant="subtitle1">Integrations</Typography>
                                        {this.isNearingLimit(utilized.integrations, limit.integrations) ? (
                                            <Typography align="center" color="error" variant="subtitle1">
                                                {utilized.integrations}/{limit.integrations}
                                            </Typography>
                                        ) : (
                                            <Typography align="center" color="primary" variant="subtitle1">
                                                {utilized.integrations}/{limit.integrations}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid direction="column" item alignItems="center">
                                        <Typography variant="subtitle1">Projects</Typography>
                                        {this.isNearingLimit(utilized.projects, limit.projects) ? (
                                            <Typography align="center" color="error" variant="subtitle1">
                                                {utilized.projects}/{limit.projects}
                                            </Typography>
                                        ) : (
                                            <Typography align="center" color="primary" variant="subtitle1">
                                                {utilized.projects}/{limit.projects}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid direction="column" item alignItems="center">
                                        <Typography variant="subtitle1">User Accounts</Typography>
                                        {this.isNearingLimit(utilized.accounts, limit.accounts) ? (
                                            <Typography align="center" color="error" variant="subtitle1">
                                                {utilized.accounts}/{limit.accounts}
                                            </Typography>
                                        ) : (
                                            <Typography align="center" color="primary" variant="subtitle1">
                                                {utilized.accounts}/{limit.accounts}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid direction="row" container item justify="center">
                        <Grid item xs={10} md={11}>
                            <Typography align="center" variant="caption">
                                Please be aware that when downgrading your subscription resources may need to be removed. To understand how resources are
                                removed when downgrading your subscription, please refer to the documentation <Link href={RoutePaths.Documentation}>here</Link>.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(populateSubscriptionLimitDataHOC(Subscription)));
