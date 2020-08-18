import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        block: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
        },
    })
);

interface BlockProps {}

export default function Block(props: PropsWithChildren<BlockProps>) {
    const classes = useStyles(props);
    return <div className={classes.block}>{props.children}</div>;
}
