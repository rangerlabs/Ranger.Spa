import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, IconButton, Typography, Tooltip, Collapse } from '@material-ui/core';
import { useState, PropsWithChildren } from 'react';
import ExpandLess from '@material-ui/icons/ExpandLess';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        titlePadding: {
            paddingBottom: '0px',
        },
        expandIcon: {
            transition: theme.transitions.create(['transform'], {
                duration: 500,
            }),
        },
        expanded: {
            transform: 'rotate(-180deg)',
        },
        collapsed: {
            transform: 'rotate(0)',
        },
    })
);

interface SampleRequestProps {}

export default function SampleRequest(props: PropsWithChildren<SampleRequestProps>) {
    const classes = useStyles(props);
    const [expanded, setExpanded] = useState(false);

    return (
        <React.Fragment>
            <Typography display="inline" variant="subtitle1">
                Sample Request
            </Typography>
            <Tooltip title={expanded ? 'Collapse' : 'Expand'} placement="right">
                <span>
                    <IconButton aria-label="expand" onClick={() => setExpanded(!expanded)}>
                        <ExpandLess className={classNames(classes.expandIcon, expanded ? classes.expanded : classes.collapsed)} />
                    </IconButton>
                </span>
            </Tooltip>
            <Collapse unmountOnExit in={expanded} timeout={500}>
                {props.children}
            </Collapse>
        </React.Fragment>
    );
}
