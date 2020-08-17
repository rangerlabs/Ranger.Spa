import { createStyles, Theme } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        code: {
            fontFamily: 'monospace',
            background: 'lightgray',
            display: 'inline',
        },
    })
);

interface CodeProps {}

export default function Code(props: PropsWithChildren<CodeProps>) {
    const classes = useStyles(props);
    return <span className={classes.code}>{props.children}</span>;
}
