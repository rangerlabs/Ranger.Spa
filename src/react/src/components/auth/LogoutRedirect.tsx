import * as React from 'react';
import UserManager from '../../services/UserManager';
import { ApplicationState } from '../../stores';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { createStyles, Grid, Typography, LinearProgress, Theme, withStyles, WithStyles } from '@material-ui/core';
import RoutePaths from '../RoutePaths';

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
interface LogoutRedirectProps extends WithStyles<typeof styles> {
    push: typeof push;
    user: Oidc.User;
    isLoadingUser: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
        isLoadingUser: state.oidc.isLoadingUser,
    };
};

class LogoutRedirect extends React.Component<LogoutRedirectProps> {
    componentDidMount() {
        if (!this.props.isLoadingUser && this.props.user) {
            const idTokenHint = this.props.user.id_token;
            UserManager.signoutRedirect({ id_token_hint: idTokenHint });
        } else {
            this.props.push(RoutePaths.Landing);
        }
    }

    render() {
        return (
            <div className={this.props.classes.layout}>
                <Grid container direction="column" alignItems="center" spacing={3}>
                    <Grid item xs={12}>
                        <Typography align="center" variant="h5">
                            Logging out of Ranger.
                        </Typography>
                        <LinearProgress />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    { push }
)(withStyles(styles, { withTheme: true })(LogoutRedirect));
