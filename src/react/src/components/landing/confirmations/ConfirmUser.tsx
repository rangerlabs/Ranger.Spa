import * as React from 'react';
import { Typography, LinearProgress, createStyles, Theme, WithStyles, Button, withStyles, Grid } from '@material-ui/core';
import * as queryString from 'query-string';
import IConfirmModel from '../../../models/landing/IConfirmModel';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import UserService from '../../../services/UserService';

const userService = new UserService();

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
    });

interface ConfirmUserProps extends WithStyles<typeof styles> {
    push: typeof push;
}

interface ConfirmUserState {
    domain: string;
    confirmed: boolean;
    isRequesting: boolean;
}

class ConfirmUser extends React.Component<ConfirmUserProps, ConfirmUserState> {
    state: ConfirmUserState = {
        domain: '',
        confirmed: undefined,
        isRequesting: true,
    };

    getRegistrationKeyFromParams(): string {
        const params = queryString.parse(window.location.search);
        const registrationKey = params['registrationKey'] as string;
        return registrationKey;
    }

    getUserIdFromParams(): string {
        const params = queryString.parse(window.location.search);
        const userId = params['userId'] as string;
        return userId;
    }

    getDomainFromParams(): string {
        const params = queryString.parse(window.location.search);
        const domain = params['domain'] as string;
        return domain;
    }

    componentDidMount() {
        const domain = this.getDomainFromParams();
        this.setState({ domain: domain });
        const registrationKey = this.getRegistrationKeyFromParams();
        const userId = this.getUserIdFromParams();
        const confirmModel = {
            Domain: domain,
            UserId: userId,
            RegistrationKey: registrationKey,
        } as IConfirmModel;
        userService
            .confirm(confirmModel)
            .then(v => {
                setTimeout(() => {
                    this.setState({ confirmed: v, isRequesting: false });
                }, 375);
            })
            .catch(r => {
                this.setState({ isRequesting: false });
            });
    }

    render() {
        return (
            <div className={this.props.classes.layout}>
                <Grid container direction="column" alignItems="center" spacing={3}>
                    {this.state.isRequesting && (
                        <Grid item xs={12}>
                            <Typography align="center" variant="h5">
                                Please wait while we confirm your account.
                            </Typography>
                            <LinearProgress />
                        </Grid>
                    )}
                    {!this.state.isRequesting && this.state.confirmed && (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <Typography gutterBottom align="center" variant="h5">
                                    Your account is confirmed.
                                </Typography>
                                <Typography gutterBottom align="center" variant="h5">
                                    Click below to get started.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
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
                        </React.Fragment>
                    )}
                    {!this.state.isRequesting && !this.state.confirmed && (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <Typography gutterBottom align="center" variant="h5">
                                    Failed to confirm the account.
                                </Typography>
                                <Typography align="center" variant="h5">
                                    The account may already be active or the verification key may be incorrect.
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    )}
                </Grid>
            </div>
        );
    }
}

export default connect(
    null,
    { push }
)(withStyles(styles, { withTheme: true })(ConfirmUser));
