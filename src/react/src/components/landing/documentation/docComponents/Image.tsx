import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import Block from './Block';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        img: {
            textAlign: 'center',
            marginBottom: theme.spacing(3),
        },
        paper: {
            padding: theme.spacing(4),
        },
    })
);

interface ImageProps {
    src: string;
    alt: string;
}

export default function Image(props: PropsWithChildren<ImageProps>) {
    const classes = useStyles(props);
    return (
        <Block>
            <Paper elevation={3}>
                <div className={classes.img}>
                    <img style={{ maxWidth: '70%' }} src={props.src} alt={props.alt} />
                </div>
            </Paper>
        </Block>
    );
}
