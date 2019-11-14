import * as React from 'react';
import UserManager from '../../services/UserManager';
import { User } from 'oidc-client';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { CallbackComponent } from 'redux-oidc';
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

interface CallbackProps extends WithStyles<typeof styles> {
    push: typeof push;
    domain: string;
}
class Callback extends React.Component<CallbackProps> {
    successCallback = (user: User) => {
        // get the user's previous location, passed during signinRedirect()
        var redirectPath = user.state.path as string;
        redirectPath = RoutePaths.Dashboard;
        this.props.push(redirectPath);
    };

    errorCallback = (error: Error) => {
        console.log(error);
        this.props.push('/');
    };

    render() {
        return (
            <CallbackComponent userManager={UserManager} successCallback={this.successCallback} errorCallback={this.errorCallback}>
                <div className={this.props.classes.layout}>
                    <Grid container direction="column" alignItems="center" spacing={3}>
                        <Grid item xs={12}>
                            <Typography align="center" variant="h5">
                                Loading Ranger.
                            </Typography>
                            <LinearProgress />
                        </Grid>
                    </Grid>
                </div>
            </CallbackComponent>
        );
    }
}

export default connect(
    null,
    { push }
)(withStyles(styles, { withTheme: true })(Callback));
