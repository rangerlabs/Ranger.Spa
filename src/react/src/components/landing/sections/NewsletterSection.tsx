import * as React from 'react';
import { Theme, createStyles, Grid, Paper } from '@material-ui/core';
import Newsletter from '../newsletter/Newsletter';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        background: {
            backgroundColor: theme.palette.primary.main,
        },
    })
);

export default function NewsletterSection() {
    const classes = useStyles();
    return (
        <Grid className={classes.background} container alignContent="center" justify="center" spacing={5}>
            <Grid item md={5} xs={12}>
                <Paper elevation={3}>
                    <Newsletter />
                </Paper>
            </Grid>
        </Grid>
    );
}
