import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Grid, Typography, Button, Slide, Paper, Box, IconButton, Container } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import CreateGeofence from '../../../../assets/create-geofence.gif';
import ArrowDown from 'mdi-material-ui/ArrowDown';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            height: `calc(100vh - 64px)`,
        },
        typography: {
            [theme.breakpoints.up('md')]: {
                textAlign: 'left',
            },
            textAlign: 'center',
            color: theme.palette.common.black,
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
        heroPush: {
            paddingTop: '7%',
        },
        arrowDown: {
            position: 'absolute',
            bottom: theme.spacing(4),
        },
    });

interface HeroProps extends WithStyles<typeof styles> {
    push: typeof push;
}

class Hero extends React.Component<HeroProps> {
    handleSignUpClick = () => {
        this.props.push('/signup');
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.layout}>
                <Grid className={classes.heroPush} container alignContent="center" justify="center" spacing={5}>
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
                <Grid className={classes.arrowDown} container alignContent="center" justify="center" spacing={5}>
                    <Grid item>
                        <ArrowDown color="primary" />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(connect(null, { push })(Hero));
