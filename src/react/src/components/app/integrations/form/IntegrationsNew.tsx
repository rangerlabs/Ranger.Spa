import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Card, CardHeader, CardContent, Typography, CardMedia, Grid, ButtonBase, Box } from '@material-ui/core';
import RoutePaths from '../../../RoutePaths';
import { push } from 'connected-react-router';
import { IntegrationEnum } from '../../../../models/app/integrations/IntegrationEnum';
import { connect } from 'react-redux';
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
import populateIntegrationsHOC from '../../hocs/PopulateIntegrationsHOC';
const IntegrationApi = require('../../../../../assets/integration-api.png');

const styles = (theme: Theme) =>
    createStyles({
        card: {
            flexGrow: 1,
            height: '100%',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 0,
        },
        media: {
            height: 0,
            paddingTop: '96px',
        },
        layout: {
            margin: theme.spacing(2),
        },
        parallaxContainer: {
            position: 'absolute',
            [theme.breakpoints.up('md')]: {
                width: `calc(100% - ${theme.drawer.width}px)`,
            },
            height: '100%',
            width: '100%',
        },
        mediaRoot: {
            backgroundSize: 'contain',
        },
        rootPadding: {
            padding: theme.spacing(1),
        },
        gridButton: {
            width: '100% !important',
        },
    });

interface IntegrationsSelectProps extends WithStyles<typeof styles> {
    push: typeof push;
}

class IntegrationsNew extends React.Component<IntegrationsSelectProps> {
    handleIntegrationSelect = (integrationType: IntegrationEnum) => {
        switch (integrationType) {
            case IntegrationEnum.WEBHOOK: {
                this.props.push(RoutePaths.IntegrationsNewWebhook);
                break;
            }
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.layout}>
                    <Typography gutterBottom variant="h5" align="center">
                        What type of integration would you like to add?
                    </Typography>
                    <div className={classes.parallaxContainer}>
                        <Parallax pages={1} scrolling={true}>
                            <ParallaxLayer offset={0} speed={0.7}>
                                <Grid container spacing={3} direction="row" justify="center" alignItems="baseline">
                                    <Grid item xs={12} sm={8} md={7}>
                                        <Box marginTop={3}>
                                            <ButtonBase
                                                className={classes.gridButton}
                                                onClick={() => {
                                                    this.handleIntegrationSelect(IntegrationEnum.WEBHOOK);
                                                }}
                                            >
                                                <Card elevation={3} className={classes.card}>
                                                    <CardHeader
                                                        titleTypographyProps={{ align: 'left' }}
                                                        classes={{ root: classes.rootPadding }}
                                                        title="Webhook"
                                                    />
                                                    <CardMedia
                                                        classes={{ root: classes.mediaRoot }}
                                                        className={classes.media}
                                                        image={IntegrationApi}
                                                        title="Webhook Integration"
                                                    />
                                                    <CardContent classes={{ root: classes.rootPadding }}>
                                                        <Typography align="left" component="p">
                                                            Forward geofence events to a REST API of your choosing.
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </ButtonBase>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={8} md={7}>
                                        <ButtonBase className={classes.gridButton} onClick={() => {}}>
                                            <Card elevation={3} className={classes.card}>
                                                <CardHeader
                                                    titleTypographyProps={{ align: 'left' }}
                                                    classes={{ root: classes.rootPadding }}
                                                    title="Coming soon"
                                                />
                                                <CardMedia classes={{ root: classes.mediaRoot }} className={classes.media} title="Coming soon" />
                                                <CardContent classes={{ root: classes.rootPadding }}>
                                                    <Typography align="left" component="p">
                                                        More integrations are in the works. Check back soon.
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </ButtonBase>
                                    </Grid>
                                </Grid>
                            </ParallaxLayer>
                        </Parallax>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, { push })(withStyles(styles)(populateIntegrationsHOC(IntegrationsNew)));
