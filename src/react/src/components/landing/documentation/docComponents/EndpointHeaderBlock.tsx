import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        block: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    })
);

interface EndpointHeaderBlockProps {}

export default function EndpointHeaderBlock(props: PropsWithChildren<EndpointHeaderBlockProps>) {
    const classes = useStyles(props);
    return <div className={classes.block}>{props.children}</div>;
}
