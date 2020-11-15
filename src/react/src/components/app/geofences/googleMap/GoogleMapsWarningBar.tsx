import * as React from 'react';
import { Theme, Typography, Grow, Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bar: {
            width: '100%',
            height: theme.toolbar.height,
            background: theme.palette.warning.main,
            zIndex: theme.mixins.toolbar.zIndex,
        },
        whiteText: {
            color: theme.palette.common.white,
        },
    })
);

interface GoogleMapsWarningBarProps {
    enabled: boolean;
    message: string;
}

const GoogleMapsWarningBar = function (props: GoogleMapsWarningBarProps) {
    const classes = useStyles();
    return (
        <Grow in={props.enabled} timeout={350}>
            <Grid container direction="column" justify="center" className={classes.bar}>
                <Grid item>
                    <Typography className={classes.whiteText} align="center">
                        {props.message}
                    </Typography>
                </Grid>
            </Grid>
        </Grow>
    );
};

export default GoogleMapsWarningBar;
