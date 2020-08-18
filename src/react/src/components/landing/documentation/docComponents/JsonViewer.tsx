import { PropsWithChildren } from 'react';
import React from 'react';
import Block from './Block';
import ReactJson from 'react-json-view';
import { createStyles, makeStyles, Theme, Paper, useMediaQuery, useTheme, Typography } from '@material-ui/core';
import jsonViewerTheme from '../../../../theme/base16/ranger';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(4),
        },
        title: {
            marginBottom: theme.spacing(2),
        },
    })
);

interface JsonViewerProps {
    title: string;
    json: object;
    expandLevel?: number;
}

export default function JsonViewer(props: PropsWithChildren<JsonViewerProps>) {
    const classes = useStyles(props);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Block>
            <Paper elevation={3} className={classes.paper}>
                <Typography className={classes.title} align="left" variant="h6">
                    {props.title}
                </Typography>
                <ReactJson
                    src={props.json}
                    theme={jsonViewerTheme}
                    name={false}
                    iconStyle="circle"
                    collapsed={props.expandLevel ? props.expandLevel : 1}
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    style={{ fontSize: isMdDown ? (isSmDown ? '.875rem' : '1rem') : '1.25rem' }}
                />
            </Paper>
        </Block>
    );
}
