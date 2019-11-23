import * as React from 'react';
import UserManager from '../../services/UserManager';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import RoutePaths from '../RoutePaths';
import { createStyles, Theme, Grid, Typography, LinearProgress, withStyles, WithStyles } from '@material-ui/core';

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

interface LoginRedirectProps extends WithStyles<typeof styles> {
    push: typeof push;
    domain: string;
}

class LoginRedirect extends React.Component<LoginRedirectProps> {
    componentDidMount() {
        const domains = window.location.hostname.split('.');
        if (domains.length === 3) {
            const domain = domains[0];
            const redirectUri = `https://${domain}.${SPA_HOST}/callback`;
            UserManager.signinRedirect({ acr_values: 'tenant:' + domain, redirect_uri: redirectUri, data: { redirectUrl: RoutePaths.Dashboard } });
        } else {
            this.props.push('/enterdomain');
        }
    }

    render() {
        return (
            <div className={this.props.classes.layout}>
                <Grid container spacing={3} justify="center" alignItems="baseline">
                    <Grid item xs={12}>
                        <Typography variant="h5">Redirecting to Ranger Login.</Typography>
                        <LinearProgress />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(LoginRedirect));
