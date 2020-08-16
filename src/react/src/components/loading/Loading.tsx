import * as React from 'react';
import { Theme, createStyles, WithStyles, LinearProgress, Typography, withStyles, Grid } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            paddingTop: '20%',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    });

interface LoadingProps extends WithStyles<typeof styles> {
    message?: string;
    push: typeof push;
    wasError?: boolean;
}

interface LoadingState {
    warningTimeoutMessage: string;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
    };
};

class Loading extends React.Component<LoadingProps, LoadingState> {
    state: LoadingState = {
        warningTimeoutMessage: '',
    };
    warningTimeout = 7 * 1000;
    warningTimeoutMessage = 'The request is taking longer than expected but is still ongoing';
    errorTimeoutStaticMessage = 'An error occurred retrieving the resource. Please try again later.';
    warningTimer: number = undefined;

    componentDidMount() {
        this.warningTimer = setTimeout(() => {
            this.setState({ warningTimeoutMessage: this.warningTimeoutMessage });
        }, this.warningTimeout);
    }

    componentWillUnmount() {
        clearTimeout(this.warningTimer);
    }

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.layout}>
                <Grid container spacing={3} justify="center" alignItems="baseline">
                    <Grid item xs={12}>
                        <Typography variant="h5">{this.props.message}</Typography>
                        {this.props.wasError ? (
                            <Typography variant="subtitle1" color="error">
                                {this.errorTimeoutStaticMessage}
                            </Typography>
                        ) : (
                            <React.Fragment>
                                <Typography variant="subtitle1">{this.state.warningTimeoutMessage}</Typography>
                                <LinearProgress color="primary" />
                            </React.Fragment>
                        )}
                    </Grid>
                </Grid>
            </main>
        );
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Loading));
