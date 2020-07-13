import { PropsWithChildren } from 'react';
import React from 'react';
import Block from './Block';
import ReactJson from 'react-json-view';
import { createStyles, makeStyles, Theme, Paper, useMediaQuery, useTheme } from '@material-ui/core';
import jsonViewerTheme from '../../../../theme/base16/ranger';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(4),
        },
    })
);

interface JsonViewerProps {
    json: object;
}

export default function JsonViewer(props: PropsWithChildren<JsonViewerProps>) {
    const classes = useStyles(props);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Block>
            <Paper elevation={3} className={classes.paper}>
                <ReactJson
                    src={props.json}
                    theme={jsonViewerTheme}
                    iconStyle="circle"
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    style={{ fontSize: isMdDown ? (isSmDown ? '.875rem' : '1rem') : '1.25rem' }}
                />
            </Paper>
        </Block>
    );
}
