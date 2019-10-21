import * as React from 'react';
import { Theme, createStyles, WithStyles, LinearProgress, Typography, withStyles, Grid } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import RoutePaths from '../../RoutePaths';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.toolbar.height,
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    });

interface LoadingProps extends WithStyles<typeof styles> {
    message: string;
    push: typeof push;
}

interface LoadingState {
    warningTimeoutMessage: string;
    errorTimeoutMessage: string;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
    };
};

class Loading extends React.Component<LoadingProps, LoadingState> {
    state: LoadingState = {
        warningTimeoutMessage: '',
        errorTimeoutMessage: '',
    };
    warningTimeout = 4 * 1000;
    warningTimeoutMessage = "This is taking longer than expected but we haven't given up yet.";
    errorTimeout = 6 * 1000;
    errorTimeoutMessage = "Hold on, we're taking you home.";
    redirectTimeout = 1.3 * 1000;
    warningTimer: number = undefined;
    errorTimer: number = undefined;
    redirectTimer: number = undefined;

    componentDidMount() {
        this.warningTimer = setTimeout(() => {
            this.setState({ warningTimeoutMessage: this.warningTimeoutMessage });
            this.errorTimer = setTimeout(() => {
                this.setState({ errorTimeoutMessage: this.errorTimeoutMessage });
                this.redirectTimer = setTimeout(() => {
                    this.props.push(RoutePaths.Dashboard);
                }, this.redirectTimeout);
            }, this.errorTimeout);
        }, this.warningTimeout);
    }

    componentWillUnmount() {
        clearTimeout(this.redirectTimer);
        clearTimeout(this.errorTimer);
        clearTimeout(this.warningTimer);
    }

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.layout}>
                <Grid container spacing={3} justify="center" alignItems="baseline">
                    <Grid item xs={12}>
                        <Typography variant="h5">{this.props.message}</Typography>
                        <Typography variant="subtitle1">{this.state.warningTimeoutMessage}</Typography>
                        <LinearProgress color="primary" variant="query" />
                        <Typography variant="subtitle1">{this.state.errorTimeoutMessage}</Typography>
                    </Grid>
                </Grid>
            </main>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(withStyles(styles)(Loading));
