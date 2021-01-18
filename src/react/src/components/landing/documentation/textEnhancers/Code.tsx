import { createStyles, Theme, useTheme, useMediaQuery } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        code: {
            fontFamily: 'monospace',
            background: '#e0e0e0',
            display: 'inline',
            fontSize: '1rem',
        },
    })
);

interface CodeProps {}

export default function Code(props: PropsWithChildren<CodeProps>) {
    const classes = useStyles(props);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <span style={{ fontSize: isMdDown ? (isSmDown ? '.875rem' : '1rem') : '1.25rem' }} className={classes.code}>
            {props.children}
        </span>
    );
}
