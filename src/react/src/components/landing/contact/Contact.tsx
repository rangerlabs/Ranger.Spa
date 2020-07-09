import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography } from '@material-ui/core';
import Footer from '../footer/Footer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        push: {
            paddingTop: '3%',
        },
        maxWidth: {
            maxWidth: '800px',
        },
    })
);

interface ContactProps {}

export default function Contact(props: ContactProps) {
    const classes = useStyles(props);

    return (
        <React.Fragment>
            <Grid className={classes.push} container direction="column" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            Contact Us
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item justify="space-evenly" alignItems="center" spacing={3} xs={12} md={8}>
                    <Grid item xs={11} sm={8} md={5} lg={2}></Grid>
                </Grid>
            </Grid>
            <Footer />
        </React.Fragment>
    );
}
