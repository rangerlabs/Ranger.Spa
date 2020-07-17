import * as React from 'react';
import { Theme, createStyles, Grid, Paper, Typography } from '@material-ui/core';
import Newsletter from '../newsletter/Newsletter';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            padding: theme.spacing(4),
            width: 'auto',
            marginTop: theme.toolbar.height,
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        typography: {
            color: theme.palette.common.white,
        },
        paper: {
            height: '100%',
        },
    })
);

export default function NewsletterSection() {
    const classes = useStyles();
    return (
        <div id="newsletter-section" className={classes.layout}>
            <div>
                <Typography align="center" gutterBottom className={classes.typography} variant="h3">
                    Ranger Newsletter
                </Typography>
                <Typography align="center" gutterBottom className={classes.typography} variant="subtitle1">
                    Be the first to hear the latest in Ranger news and features.
                </Typography>
            </div>
            <div>
                <Newsletter />
            </div>
        </div>
    );
}
