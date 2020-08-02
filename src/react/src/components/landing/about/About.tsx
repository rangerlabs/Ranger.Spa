import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Paper, Button, Box } from '@material-ui/core';
import Footer from '../footer/Footer';
import NameLogo from '../../../theme/NameLogo';
import Paragraph from '../documentation/docComponents/Paragraph';

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
                            <NameLogo width="15%" />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Paragraph>
                            Ranger was designed to be the most extensible, scalable, user and developer driven location platform available. To achieve this
                            we've built our platform to take advantage of the most bleeding-edge, cloud-native technologies.
                        </Paragraph>
                        <Paragraph>
                            Our committment to the privacy of you and your end-users is unwaivering. Ranger is committed to the privacy of its users.
                        </Paragraph>
                    </Grid>
                </Grid>
            </Grid>
            <Footer />
        </React.Fragment>
    );
}
