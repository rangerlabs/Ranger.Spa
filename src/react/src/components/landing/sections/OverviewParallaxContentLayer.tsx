import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Typography, Button, Slide, Paper } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import CreateGeofence from '../../../../assets/create-geofence.gif';

const styles = (theme: Theme) =>
    createStyles({
        typography: {
            [theme.breakpoints.up('md')]: {
                textAlign: 'left',
            },
            textAlign: 'center',
            color: theme.palette.common.black,
        },
        gridHeight: {
            height: '100%',
        },
        menuItemTextColor: {
            color: theme.drawer.text.color,
        },
        signupButton: {
            marginTop: theme.spacing(3),
            minWidth: '175px',
        },
        textPush: {
            [theme.breakpoints.up('md')]: {
                marginTop: '25%',
            },
        },
    });

interface OverviewParallaxContentLayerProps extends WithStyles<typeof styles> {
    push: typeof push;
}

class OverviewParallaxContentLayer extends React.Component<OverviewParallaxContentLayerProps> {
    handleSignUpClick = () => {
        this.props.push('/signup');
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid className={classes.gridHeight} container alignContent="center" justify="center" spacing={5}>
                <Grid item md={4} xs={10}>
                    <div className={classes.textPush}>
                        <Typography gutterBottom className={classes.typography} variant="subtitle1">
                            HOSTED APIs FOR
                        </Typography>
                        <Typography className={classes.typography} variant="h3">
                            BOUNDLESS GEOFENCING
                        </Typography>
                        <div className={classes.typography}>
                            <Button color="primary" variant="contained" className={classes.signupButton} onClick={this.handleSignUpClick}>
                                Sign up for free
                            </Button>
                        </div>
                    </div>
                </Grid>
                <Grid item md={5} xs={10}>
                    <Paper elevation={3}>
                        <img width="100%" src={CreateGeofence} alt="Create Geofence" />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(connect(null, { push })(OverviewParallaxContentLayer));
