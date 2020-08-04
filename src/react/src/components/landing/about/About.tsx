import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Paper, Button, Box } from '@material-ui/core';
import Footer from '../footer/Footer';
import NameLogo from '../../../theme/NameLogo';
import Paragraph from '../documentation/docComponents/Paragraph';
import Block from '../documentation/docComponents/Block';

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
                <Grid container item justify="center" spacing={5}>
                    <Grid item xs={12}>
                        <Box textAlign="center">
                            <NameLogo width="15%" />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item justify="center">
                    <Grid item xs={6}>
                        <Block>
                            <Typography gutterBottom variant="h6">
                                Ranger was built to be the most extendable, configurable, and easy-to-use location platform available. With Ranger, mobile apps
                                become actionable when it matters most to you and your users.
                            </Typography>
                        </Block>
                        <Block>
                            <Typography gutterBottom variant="subtitle1">
                                The advent of smart devices has led to an overwhelming volume of location data. Ranger’s SaaS infrastructure enables our
                                customers to cut through the noise and take action when and where they need. We provide a modern solution to a modern problem -
                                and to do this, we’ve built Ranger on today’s most bleeding-edge, cloud-native technologies. For our customers, this means
                                reliability and scalability for their business critical apps.
                            </Typography>
                        </Block>
                        <Block>
                            <Typography gutterBottom variant="subtitle1">
                                What’s more, our commitment to the privacy of you and your end-users is unwavering. We do not sell or otherwise share location
                                data and our strict architectural standards ensures your user’s location data is only ever visible to within your organization.
                            </Typography>
                        </Block>
                    </Grid>
                </Grid>
                <Grid container item justify="center">
                    <Grid item xs={2}>
                        <Paragraph></Paragraph>
                    </Grid>
                    <Grid item xs={4}>
                        <Paragraph>
                            The advent of smart devices has led to an overwhelming volume of location data. Ranger’s SaaS infrastructure enables our customers
                            to cut through the noise and take action when and where they need. We provide a modern solution to a modern problem - and to do
                            this, we’ve built Ranger on today’s most bleeding-edge, cloud-native technologies. For our customers, this means reliability and
                            scalability for their business critical apps.
                        </Paragraph>
                    </Grid>
                </Grid>
            </Grid>
            <Footer />
        </React.Fragment>
    );
}
