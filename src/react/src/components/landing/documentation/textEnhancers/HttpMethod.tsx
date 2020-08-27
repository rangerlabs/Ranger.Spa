import { Theme, createStyles, WithStyles, withStyles, Typography } from '@material-ui/core';
import Constants from '../../../../theme/Constants';
import { blue, yellow, red, orange } from '@material-ui/core/colors';
import React from 'react';
import classNames from 'classnames';

const styles = (theme: Theme) =>
    createStyles({
        font: {
            color: theme.palette.common.white,
            padding: '2px 8px',
            fontWeight: 800,
            borderRadius: '2px',
        },
        get: {
            background: Constants.COLORS.PRIMARY_COLOR,
        },
        post: {
            background: blue[800],
        },
        put: {
            background: yellow[800],
        },
        patch: {
            background: orange[800],
        },
        delete: {
            background: red[800],
        },
    });

interface HttpMethodProps extends WithStyles<typeof styles> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

const HttpMethod = function (props: HttpMethodProps) {
    const { classes, method } = props;
    switch (method) {
        case 'GET': {
            return (
                <Typography className={classNames(classes.font, classes.get)} variant="caption">
                    GET
                </Typography>
            );
        }
        case 'POST': {
            return (
                <Typography className={classNames(classes.font, classes.post)} variant="caption">
                    POST
                </Typography>
            );
        }
        case 'PUT': {
            return (
                <Typography className={classNames(classes.font, classes.put)} variant="caption">
                    PUT
                </Typography>
            );
        }
        case 'PATCH': {
            return (
                <Typography className={classNames(classes.font, classes.patch)} variant="caption">
                    PATCH
                </Typography>
            );
        }
        case 'DELETE': {
            return (
                <Typography className={classNames(classes.font, classes.delete)} variant="caption">
                    DELETE
                </Typography>
            );
        }
    }
};

export default withStyles(styles)(HttpMethod);
