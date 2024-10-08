import React from 'react';
import PlanCard from './PlanCard';
import { Grid, Theme, createStyles, WithStyles, withStyles, Paper, Typography, Button, Hidden, Link } from '@material-ui/core';
import SubscriptionsService from '../../../services/SubscriptionsService';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import ISubscriptionLimitDetails from '../../../models/app/ISubscriptionLimitDetails';
import RoutePaths from '../../RoutePaths';
import { getUnixTime } from 'date-fns';
import { capitalCase } from 'change-case';
import GlobalConfig from '../../../helpers/GlobalConfig';
import { Plans } from '../../../helpers/Helpers';
import { push } from 'connected-react-router';
import DocRoutePaths from '../../landing/documentation/DocRoutePaths';
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
        height100: {
            height: '100%',
        },
    });

interface SubscriptionProps extends WithStyles<typeof styles> {
    subscriptionLimitDetails: ISubscriptionLimitDetails;
    push: typeof push;
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
                site: GlobalConfig.CHARGE_BEE_SITE,
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
                        created_at: getUnixTime(Date.parse(result.result.createdAt)),
                        expires_at: getUnixTime(Date.parse(result.result.expiresAt)),
                    };
                    resolve(hostedPage);
                });
            },
            success(hostedPageId: string) {},
            close: () => {
                this.setState({ loading: false });
            },
            step(step: string) {},
        });
        event.preventDefault();
    }

    openPortal() {
        this.state.cbInstance.setPortalSession(
            () =>
                new Promise(async (resolve, reject) => {
                    subscriptionsService.getPortalSession().then((response) => {
                        const portalSession = {
                            id: response.result.id,
                            token: response.result.token,
                            access_url: response.result.accessUrl,
                            status: response.result.status,
                            object: response.result.object,
                            customerId: response.result.customerId,
                            created_at: getUnixTime(Date.parse(response.result.createdAt)),
                            expires_at: getUnixTime(Date.parse(response.result.expiresAt)),
                        };
                        resolve(portalSession);
                    });
                })
        );
        let cbPortal = this.state.cbInstance.createChargebeePortal();
        cbPortal.open({
            close() {},
        });
    }

    isLimitReached = (utilized: number, limit: number): boolean => utilized === limit;
    isNearingLimit = (utilized: number, limit: number): boolean => utilized / limit >= 0.9 || utilized + 1 === limit;
    isCurrentPlan = (planId: string): boolean => planId === this.props.subscriptionLimitDetails.planId;
    numberWithCommas = (x: number): string => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    render() {
        const { classes } = this.props;
        const { utilized, limit } = this.props.subscriptionLimitDetails;
        return (
            <React.Fragment>
                <Grid className={classes.height100} container direction="column" justify="space-evenly">
                    <Grid container item justify="space-evenly" alignItems="center">
                        <Grid item xs={11} sm={8} md={5} lg={2}>
                            <PlanCard
                                isCurrentPlan={this.isCurrentPlan('sandbox')}
                                planId="sandbox"
                                planName="Sandbox"
                                message="Perfect for getting a feel and testing integrations"
                                limitDetails={Plans.filter((p) => p.name === 'Sandbox')[0].limitDetails}
                                cost="FREE"
                                onUpgrade={this.upgrade.bind(this)}
                                forceDisable={!this.props.subscriptionLimitDetails.active}
                            />
                        </Grid>
                        <Grid item xs={11} sm={8} md={5} lg={2}>
                            <PlanCard
                                isCurrentPlan={this.isCurrentPlan('startup')}
                                planId="startup"
                                planName="Startup"
                                message="When you're ready to grow and adding integrations"
                                limitDetails={Plans.filter((p) => p.name === 'Startup')[0].limitDetails}
                                cost="$49 / Month"
                                onUpgrade={this.upgrade.bind(this)}
                                forceDisable={!this.props.subscriptionLimitDetails.active}
                            />
                        </Grid>
                        <Grid item xs={11} sm={8} md={5} lg={2}>
                            <PlanCard
                                isCurrentPlan={this.isCurrentPlan('pro')}
                                planId="pro"
                                planName="Pro"
                                message="Extend your reach with 5,000 geofences"
                                limitDetails={Plans.filter((p) => p.name === 'Pro')[0].limitDetails}
                                cost="$149 / Month"
                                onUpgrade={this.upgrade.bind(this)}
                                forceDisable={!this.props.subscriptionLimitDetails.active}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item justify="center">
                        <Grid item xs={10}>
                            <Paper className={classes.currentSubscription} elevation={3}>
                                <Grid container>
                                    <Hidden smDown>
                                        <Grid md={2} item />
                                    </Hidden>
                                    <Grid md={8} xs={12} item>
                                        <Typography align="center" variant="h6">
                                            Your Subscription
                                        </Typography>
                                        <Typography align="center" color="primary" variant="h6">
                                            {capitalCase(this.props.subscriptionLimitDetails.planId)}
                                        </Typography>
                                    </Grid>
                                    <Grid md={2} xs={12} item>
                                        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
                                            <Button color="primary" variant="outlined" onClick={this.openPortal.bind(this)} data-cb-type="portal">
                                                Manage
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container justify="space-around">
                                    <Grid item>
                                        <Typography variant="subtitle1">Geofences</Typography>
                                        {this.isNearingLimit(utilized.geofences, limit.geofences) ? (
                                            <Typography align="center" color="error" variant="subtitle1">
                                                {this.numberWithCommas(utilized.geofences)}/{this.numberWithCommas(limit.geofences)}
                                            </Typography>
                                        ) : (
                                            <Typography align="center" color="primary" variant="subtitle1">
                                                {this.numberWithCommas(utilized.geofences)}/{this.numberWithCommas(limit.geofences)}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">Integrations</Typography>
                                        {this.isNearingLimit(utilized.integrations, limit.integrations) ? (
                                            <Typography align="center" color="error" variant="subtitle1">
                                                {this.numberWithCommas(utilized.integrations)}/{this.numberWithCommas(limit.integrations)}
                                            </Typography>
                                        ) : (
                                            <Typography align="center" color="primary" variant="subtitle1">
                                                {this.numberWithCommas(utilized.integrations)}/{this.numberWithCommas(limit.integrations)}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">Projects</Typography>
                                        {this.isNearingLimit(utilized.projects, limit.projects) ? (
                                            <Typography align="center" color="error" variant="subtitle1">
                                                {this.numberWithCommas(utilized.projects)}/{this.numberWithCommas(limit.projects)}
                                            </Typography>
                                        ) : (
                                            <Typography align="center" color="primary" variant="subtitle1">
                                                {this.numberWithCommas(utilized.projects)}/{this.numberWithCommas(limit.projects)}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">User Accounts</Typography>
                                        {this.isNearingLimit(utilized.accounts, limit.accounts) ? (
                                            <Typography align="center" color="error" variant="subtitle1">
                                                {this.numberWithCommas(utilized.accounts)}/{this.numberWithCommas(limit.accounts)}
                                            </Typography>
                                        ) : (
                                            <Typography align="center" color="primary" variant="subtitle1">
                                                {this.numberWithCommas(utilized.accounts)}/{this.numberWithCommas(limit.accounts)}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container item justify="center" alignContent="center">
                        <Grid container item justify="center" alignContent="center">
                            <Typography align="center" variant="caption">
                                Please note, when downgrading your subscription resources may need to be removed. To understand how resources are removed when
                                downgrading, please refer to the documentation{' '}
                                <Link
                                    component="button"
                                    onClick={() => this.props.push(RoutePaths.Docs.replace(':name?', DocRoutePaths.Subscription))}
                                    variant="caption"
                                >
                                    here
                                </Link>
                                .
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, { push })(withStyles(styles)(Subscription));
