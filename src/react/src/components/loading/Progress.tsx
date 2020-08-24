import * as React from 'react';
import { createStyles, Theme, CircularProgress, makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(() =>
    createStyles({
        buttonProgress: {
            color: green[600],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    })
);

interface ProgressProps {}

const Progress = function (props: ProgressProps) {
    const classes = useStyles(props);
    return <CircularProgress size={24} className={classes.buttonProgress} />;
};

export default Progress;
