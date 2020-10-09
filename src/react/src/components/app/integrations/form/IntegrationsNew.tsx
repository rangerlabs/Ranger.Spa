import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Card, CardContent, Typography, CardMedia, Grid, ButtonBase, IconButton, Paper } from '@material-ui/core';
import RoutePaths from '../../../RoutePaths';
import { push } from 'connected-react-router';
import { IntegrationEnum } from '../../../../models/app/integrations/IntegrationEnum';
import { connect } from 'react-redux';
import populateIntegrationsHOC from '../../hocs/PopulateIntegrationsHOC';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import classNames from 'classnames';
import Webhook from '../../../../../assets/webhook@2x.png';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(3),
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        root: {
            display: 'flex',
            minWidth: '100%',
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 151,
        },
        grid: {
            padding: theme.spacing(2),
        },
        card: {
            flexGrow: 1,
            height: '100%',
        },
        title: {
            marginTop: '0px',
            padding: '0px',
        },
        return: {
            position: 'sticky',
            top: theme.toolbar.height + theme.spacing(4),
            marginLeft: theme.spacing(4),
        },
        mediaRoot: {
            backgroundSize: 'contain',
        },
        buttonBase: {
            minWidth: '100%',
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
                <IconButton className={classes.return} onClick={() => this.props.push(RoutePaths.Integrations)}>
                    <ArrowLeft />
                </IconButton>
                <Typography className={classNames(classes.title, classes.layout)} variant="h5" align="left">
                    New Integration Type
                </Typography>
                <div className={classes.layout}>
                    <Grid container spacing={3} direction="column" justify="flex-start" alignItems="center">
                        <Grid container item justify="center">
                            <Grid item xs={12}>
                                <Paper elevation={3}>
                                    <ButtonBase
                                        className={classes.buttonBase}
                                        onClick={() => {
                                            this.handleIntegrationSelect(IntegrationEnum.WEBHOOK);
                                        }}
                                    >
                                        <Card elevation={0} className={classes.root}>
                                            <CardMedia
                                                classes={{ root: classes.mediaRoot }}
                                                className={classes.cover}
                                                image={Webhook}
                                                title="Webhook Integration"
                                            />
                                            <div className={classes.details}>
                                                <CardContent className={classes.content}>
                                                    <Typography variant="h6">Webhook</Typography>
                                                    <Typography variant="subtitle1" color="textSecondary">
                                                        Forward geofence events to a REST API of your choosing.
                                                    </Typography>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    </ButtonBase>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container item justify="center">
                            <Grid item xs={12}>
                                <Paper elevation={3}>
                                    <ButtonBase
                                        className={classes.buttonBase}
                                        onClick={() => {
                                            this.handleIntegrationSelect(IntegrationEnum.PUSHER);
                                        }}
                                    >
                                        <Card elevation={0} className={classes.root}>
                                            <CardMedia
                                                classes={{ root: classes.mediaRoot }}
                                                className={classes.cover}
                                                image={Webhook}
                                                title="Pusher Channels Integration"
                                            />
                                            <div className={classes.details}>
                                                <CardContent className={classes.content}>
                                                    <Typography variant="h6">Pusher Channels</Typography>
                                                    <Typography variant="subtitle1" color="textSecondary">
                                                        Forward geofence events to Pusher Channels per device.
                                                    </Typography>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    </ButtonBase>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container item justify="center">
                            <Grid item xs={12}>
                                <ButtonBase className={classes.buttonBase} onClick={() => {}}>
                                    <Card elevation={3} className={classes.root}>
                                        <CardMedia component="div" classes={{ root: classes.mediaRoot }} className={classes.cover} title="Coming soon" />
                                        <div className={classes.details}>
                                            <CardContent className={classes.content}>
                                                <Typography variant="h6">Coming Soon!</Typography>
                                                <Typography variant="subtitle1" color="textSecondary">
                                                    More integrations are in the works. Check back soon.
                                                </Typography>
                                            </CardContent>
                                        </div>
                                    </Card>
                                </ButtonBase>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, { push })(withStyles(styles)(populateIntegrationsHOC(IntegrationsNew)));
