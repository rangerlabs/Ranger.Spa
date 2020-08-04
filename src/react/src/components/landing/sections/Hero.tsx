import * as React from 'react';
import { Theme, createStyles, Grid, Typography, Button, Paper, IconButton, useMediaQuery, useTheme, makeStyles } from '@material-ui/core';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import CreateGeofence from '../../../../assets/create-geofence.gif';
import ArrowDown from 'mdi-material-ui/ArrowDown';
import { scrollToLandingId } from '../../../helpers/Helpers';
import BackgroundLayer from './BackgroundLayer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            height: `calc(100vh - 64px)`,
            position: 'relative',
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
    })
);

interface HeroProps {
    push: typeof push;
    scrollToId: string;
}

const Hero = function (props: HeroProps) {
    function handleSignUpClick() {
        props.push('/signup');
    }

    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div className={classes.layout}>
            <BackgroundLayer />
            <Grid className={classes.heroPush} container alignContent="center" justify="center" spacing={5}>
                <Grid item md={4} xs={10}>
                    <div className={classes.textPush}>
                        <Typography gutterBottom className={classes.typography} variant="subtitle1">
                            {' '}
                            MODERN APIs FOR
                        </Typography>
                        <Typography className={classes.typography} variant="h3">
                            BOUNDLESS GEOFENCING
                        </Typography>
                        <div className={classes.typography}>
                            <Button color="primary" variant="contained" className={classes.signupButton} onClick={handleSignUpClick}>
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
            <Grid
                style={{ position: 'absolute', bottom: isSmDown ? theme.spacing(6) : theme.spacing(4) }} //push above iOS nav
                container
                alignContent="center"
                justify="center"
                spacing={5}
            >
                <Grid item>
                    <IconButton color="primary" onClick={() => scrollToLandingId(props.scrollToId)}>
                        <ArrowDown />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    );
};

export default connect(null, { push })(Hero);
