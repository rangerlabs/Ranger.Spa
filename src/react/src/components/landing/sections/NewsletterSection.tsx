import * as React from 'react';
import { Theme, createStyles, Grid, Paper, Typography } from '@material-ui/core';
import Newsletter from '../newsletter/Newsletter';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        background: {
            backgroundColor: theme.palette.primary.main,
        },
        margin: {
            marginTop: theme.spacing(8),
            marginBottom: theme.spacing(8),
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
        <div className={classes.margin}>
            <Grid id="newsletter-section" className={classes.background} container alignContent="center" justify="center" spacing={5}>
                <Grid item xs={12}>
                    <div>
                        <Typography align="center" gutterBottom className={classes.typography} variant="h3">
                            Ranger Newsletter
                        </Typography>
                        <Typography align="center" gutterBottom className={classes.typography} variant="subtitle1">
                            Be the first to hear the latest in Ranger news and features.
                        </Typography>
                    </div>
                    <Newsletter />
                </Grid>
            </Grid>
        </div>
    );
}
