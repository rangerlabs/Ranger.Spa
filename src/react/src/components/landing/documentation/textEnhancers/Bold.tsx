import { createStyles, Theme } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bold: {
            fontWeight: 700,
            display: 'inline',
        },
    })
);

interface BoldProps {}

export default function Bold(props: PropsWithChildren<BoldProps>) {
    const classes = useStyles(props);
    return <span className={classes.bold}>{props.children}</span>;
}
