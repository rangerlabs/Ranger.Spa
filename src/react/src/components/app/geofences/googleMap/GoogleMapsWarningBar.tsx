import * as React from 'react';
import { CircularProgress, Theme, Typography, Grow } from '@material-ui/core';
import { createPortal } from 'react-dom';
import { makeStyles, createStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bar: {
            width: '100%',
            height: theme.toolbar.height,
            background: theme.palette.warning.main,
            zIndex: theme.mixins.toolbar.zIndex,
            position: 'absolute',
            top: 0,
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
            <div className={classes.bar}>
                <Typography align="center">{props.message}</Typography>
            </div>
        </Grow>
    );
};

export default GoogleMapsWarningBar;
