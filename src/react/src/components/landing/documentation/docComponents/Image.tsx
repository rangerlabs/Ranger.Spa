import { Theme, createStyles, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import Block from './Block';
const ModalImage = require('react-modal-image');

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        img: {
            textAlign: 'center',
            marginBottom: theme.spacing(3),
        },
        paper: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
    })
);

interface ImageProps {
    src: string;
    alt: string;
    maxWidth?: number;
}

export default function Image(props: ImageProps) {
    const classes = useStyles(props);
    return (
        <Block>
            <Paper elevation={3} className={classes.paper}>
                <div className={classes.img} style={{ maxWidth: props.maxWidth ? `${props.maxWidth}%` : '70%' }}>
                    <ModalImage small={props.src} large={props.src} alt={props.alt} hideDownload hideZoom />;
                </div>
            </Paper>
        </Block>
    );
}
