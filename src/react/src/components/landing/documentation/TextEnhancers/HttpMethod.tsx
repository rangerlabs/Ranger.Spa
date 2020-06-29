import { Theme, createStyles, WithStyles, withStyles, Typography } from '@material-ui/core';
import Constants from '../../../../theme/Constants';
import { blue, yellow, red } from '@material-ui/core/colors';
import React from 'react';

const styles = (theme: Theme) =>
    createStyles({
        get: {
            background: blue[700],
        },
        post: {
            background: Constants.COLORS.PRIMARY_COLOR,
        },
        put: {
            background: yellow[600],
        },
        delete: {
            background: red[500],
        },
    });

interface HttpMethodProps extends WithStyles<typeof styles> {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const HttpMethod = function (props: HttpMethodProps) {
    const { classes, method } = props;
    switch (method) {
        case 'GET': {
            return (
                <Typography className={classes.get} variant="caption">
                    GET
                </Typography>
            );
        }
        case 'POST': {
            return (
                <Typography className={classes.post} variant="caption">
                    POST
                </Typography>
            );
        }
        case 'PUT': {
            return (
                <Typography className={classes.put} variant="caption">
                    PUT
                </Typography>
            );
        }
        case 'DELETE': {
            return (
                <Typography className={classes.delete} variant="caption">
                    DELETE
                </Typography>
            );
        }
    }
};

export default withStyles(styles)(HttpMethod);
