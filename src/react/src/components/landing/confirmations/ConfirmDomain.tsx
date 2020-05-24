import * as React from 'react';
import { Typography, LinearProgress, createStyles, Theme, WithStyles, Button, withStyles, Grid } from '@material-ui/core';
import TenantService from '../../../services/TenantService';
import * as queryString from 'query-string';
import IConfirmModel from '../../../models/landing/IConfirmModel';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
const tenantService = new TenantService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginTop: theme.toolbar.height * 2,
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        flexButtonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
    });

interface ConfirmDomainProps extends WithStyles<typeof styles> {
    push: typeof push;
}

interface ConfirmDomainState {
    domain: string;
    confirmed: boolean;
    isRequesting: boolean;
}

class ConfirmDomain extends React.Component<ConfirmDomainProps, ConfirmDomainState> {
    state: ConfirmDomainState = {
        domain: '',
        confirmed: undefined,
        isRequesting: true,
    };

    getTokenFromParams(): string {
        const params = queryString.parse(window.location.search);
        const token = params['token'] as string;
        return token;
    }

    getDomainFromParams(): string {
        const params = queryString.parse(window.location.search);
        const domain = params['domain'] as string;
        return domain;
    }

    componentDidMount() {
        const domain = this.getDomainFromParams();
        this.setState({ domain: domain });
        const token = this.getTokenFromParams();
        const confirmModel = {
            Token: token,
        } as IConfirmModel;
        tenantService.confirm(domain, confirmModel).then((v) => {
            if (v.isError) {
                this.setState({ isRequesting: false });
            } else {
                this.setState({ confirmed: true, isRequesting: false });
            }
        });
    }

    render() {
        return (
            <div className={this.props.classes.layout}>
                {this.state.isRequesting && (
                    <Grid container spacing={3} justify="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h5">Please wait while we confirm your domain.</Typography>
                            <LinearProgress />
                        </Grid>
                    </Grid>
                )}
                {!this.state.isRequesting && this.state.confirmed && (
                    <React.Fragment>
                        <Grid direction="column" container spacing={3} justify="center" alignItems="center">
                            <Grid item>
                                <Typography gutterBottom align="center" variant="h5">
                                    Your domain is confirmed.
                                </Typography>
                                <Typography gutterBottom align="center" variant="subtitle1">
                                    Click below to get started.
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        this.state.domain
                                            ? window.location.assign(`https://${this.state.domain}.${SPA_HOST}${RoutePaths.Login}`)
                                            : this.props.push(RoutePaths.Landing);
                                    }}
                                >
                                    Sign in
                                </Button>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
                {!this.state.isRequesting && !this.state.confirmed && (
                    <Grid container spacing={3} justify="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography align="center" variant="h5">
                                Failed to confirm domain.
                            </Typography>
                            <Typography align="center" variant="subtitle1">
                                Verify the registration key is correct.
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(ConfirmDomain));
