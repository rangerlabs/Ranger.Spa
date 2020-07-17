import * as React from 'react';
import { Theme, createStyles, Grid, Paper, Typography } from '@material-ui/core';
import Newsletter from '../newsletter/Newsletter';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        background: {
            backgroundColor: theme.palette.primary.main,
        },
        typography: {
            color: theme.palette.common.white,
        },
    })
);

export default function NewsletterSection() {
    const classes = useStyles();
    return (
        <Grid className={classes.background} container alignContent="center" justify="center" spacing={5}>
            <Grid item xs={12}>
                <Typography gutterBottom className={classes.typography} variant="h3">
                    Ranger Newsletter
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography gutterBottom className={classes.typography} variant="subtitle1">
                    Be the first to hear all the latest Ranger news and features.
                </Typography>
            </Grid>
            <Grid item md={5} xs={12}>
                <Paper elevation={3}>
                    <Newsletter />
                </Paper>
            </Grid>
        </Grid>
    );
}
