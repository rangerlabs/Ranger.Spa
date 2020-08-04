import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Box, useMediaQuery, useTheme } from '@material-ui/core';
import Footer from '../footer/Footer';
import NameLogo from '../../../theme/NameLogo';
import Paragraph from '../documentation/docComponents/Paragraph';
import Block from '../documentation/docComponents/Block';
import CromwellProfile from '../../../../assets/cromwell-profile.jpg';

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
        profilePhoto: {
            textAlign: 'center',
        },
    })
);

interface AboutProps {}

export default function About(props: AboutProps) {
    const classes = useStyles(props);
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <React.Fragment>
            <Grid className={classes.push} container direction="column" spacing={5}>
                <Grid container item justify="center" spacing={5}>
                    <Grid item xs={12}>
                        <Box textAlign="center">
                            <NameLogo width={isMdDown ? '25%' : isSmDown ? '50%' : '15%'} />
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item justify="center">
                    <Grid item md={6} xs={11}>
                        <Block>
                            <Typography style={{ fontWeight: 400 }} gutterBottom variant="h6">
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
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            The Ranger Team
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item justify="center">
                    <Grid className={classes.profilePhoto} item md={2} xs={4}>
                        <img width="50%" src={CromwellProfile} alt="Nick Cromwell Image" />
                    </Grid>
                    <Grid item md={4} xs={8}>
                        <Typography variant="h6">Nick Cromwell</Typography>
                        <Typography variant="h6">Founder, Chief Architect</Typography>
                        <Block>
                            <Typography gutterBottom variant="subtitle1">
                                The Founder and Chief Architect of Ranger, Nick has a decade of experience delivering scalable, distributed architectures to
                                market. He holds a BS degree in Applied Mathematics from Kent State University and takes pride in his hometown of Cleveland,
                                Ohio.
                            </Typography>
                            <Typography gutterBottom>
                                Nick's passion for architecting Ranger was founded out of necessity when he set out to design a mobile app.
                            </Typography>
                        </Block>
                    </Grid>
                </Grid>
            </Grid>
            <Footer />
        </React.Fragment>
    );
}
