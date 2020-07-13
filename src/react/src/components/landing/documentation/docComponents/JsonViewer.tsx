import { PropsWithChildren } from 'react';
import React from 'react';
import Block from './Block';
import ReactJson from 'react-json-view';
import { createStyles, makeStyles, Theme, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
    })
);

interface JsonViewerProps {
    json: object;
}

export default function JsonViewer(props: PropsWithChildren<JsonViewerProps>) {
    const classes = useStyles(props);
    return (
        <Block>
            <Paper elevation={3} className={classes.paper}>
                <ReactJson
                    src={props.json}
                    theme="grayscale:inverted"
                    iconStyle="circle"
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                />
            </Paper>
        </Block>
    );
}
