import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Paper, Button, Box } from '@material-ui/core';
import Footer from '../footer/Footer';
import NameLogo from '../../../theme/NameLogo';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        push: {
            paddingTop: '3%',
        },
        maxWidth: {
            maxWidth: '800px',
        },
        layout: {
            padding: theme.spacing(4),
            width: 'auto',
            marginTop: theme.toolbar.height * 2,
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(500 + theme.spacing(2 * 2))]: {
                width: 500,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    })
);

interface AboutProps {}

export default function About(props: AboutProps) {
    const classes = useStyles(props);

    return (
        <React.Fragment>
            <Grid className={classes.push} container direction="column" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            About
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box textAlign="center">
                            <NameLogo width="30%" />
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={11} md={5}>
                    <Typography gutterBottom variant="body1">
                        Ranger was built on three premises: to be the most extendable, scalable, and consumer driven location platform available. To achieve
                        this we've built our platform to take advantage of the most bleeding-edge, cloud-native technologies. From our customers to yours, this
                        ensures reliability and transparency. Reliability that our platform is available to you and your users, and Transparency that what we
                        say is secure will remain secure. Our committment to the privacy of your end-users is unwaivering.
                    </Typography>
                    <Typography gutterBottom variant="body1"></Typography>
                </Grid>
            </Grid>
            <Footer />
        </React.Fragment>
    );
}
