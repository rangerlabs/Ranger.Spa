import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Paper, Button } from '@material-ui/core';
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
    })
);

interface AboutProps {}

export default function About(props: AboutProps) {
    const classes = useStyles(props);

    return (
        <React.Fragment>
            <Grid container className={classes.push} justify="center" spacing={5}>
                <Grid item xs={12}>
                    <NameLogo width="30%" />
                </Grid>
                <Grid item xs={12}>
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
