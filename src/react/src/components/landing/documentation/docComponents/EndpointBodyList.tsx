import React from 'react';
import { makeStyles, Theme, createStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        required: {
            color: theme.palette.error.main,
        },
        fontSize: {
            fontSize: theme.typography.pxToRem(11),
        },
    })
);

interface EndpointBodyListItemProps {
    name: string;
    type: React.ReactNode;
    required?: boolean;
    description: string;
    item?: React.ReactNode;
}

const formatTitle = function (props: EndpointBodyListItemProps) {
    const classes = useStyles(props);
    return props.required ? (
        <React.Fragment>
            <Typography className={classes.fontSize} display="block" color="textPrimary">
                <span className={classes.required}>{props.name}</span>: {props.type}
            </Typography>
        </React.Fragment>
    ) : (
        <Typography className={classes.fontSize} display="block" color="textPrimary">
            {props.name}: {props.type}
        </Typography>
    );
};

export function EndpointBodyListItem(props: EndpointBodyListItemProps) {
    return (
        <React.Fragment>
            {formatTitle(props)}
            <Typography className={classes.fontSize} display="block">
                {props.description}
            </Typography>
            {props.item}
        </React.Fragment>
    );
}
