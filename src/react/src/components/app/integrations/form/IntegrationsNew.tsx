import * as React from 'react';
import {
    Theme,
    createStyles,
    WithStyles,
    withStyles,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CardMedia,
    Grid,
    ButtonBase,
    Box,
    Paper,
} from '@material-ui/core';
import RoutePaths from '../../../RoutePaths';
import { push } from 'connected-react-router';
import { IntegrationEnum } from '../../../../models/app/integrations/IntegrationEnum';
import { connect } from 'react-redux';
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
import populateIntegrationsHOC from '../../hocs/PopulateIntegrationsHOC';
const IntegrationApi = require('../../../../../assets/integration-api.png');

const styles = (theme: Theme) =>
    createStyles({
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
        paper: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
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
            <Grid container justify="center" className={classes.grid}>
                <Grid item md={8} sm={10} xs={11}>
                    <Paper elevation={3} className={classes.paper}>
                        <Box mb={3}>
                            <Typography gutterBottom variant="h5" align="center">
                                Select Integration Type
                            </Typography>
                        </Box>
                        <Grid container spacing={3} direction="column" justify="flex-start" alignItems="center">
                            <Grid container item justify="center">
                                <Grid item xs={8}>
                                    <ButtonBase
                                        className={classes.buttonBase}
                                        onClick={() => {
                                            this.handleIntegrationSelect(IntegrationEnum.WEBHOOK);
                                        }}
                                    >
                                        <Card elevation={4} className={classes.root}>
                                            <CardMedia
                                                classes={{ root: classes.mediaRoot }}
                                                className={classes.cover}
                                                image={IntegrationApi}
                                                title="Webhook Integration"
                                            />
                                            <div className={classes.details}>
                                                <CardContent className={classes.content}>
                                                    <Typography component="h5" variant="h5">
                                                        Webhook
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="textSecondary">
                                                        Forward geofence events to a REST API of your choosing.
                                                    </Typography>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    </ButtonBase>
                                </Grid>
                            </Grid>
                            <Grid container item justify="center">
                                <Grid item xs={8}>
                                    <ButtonBase className={classes.buttonBase} onClick={() => {}}>
                                        <Card elevation={4} className={classes.root}>
                                            <CardMedia
                                                classes={{ root: classes.mediaRoot }}
                                                className={classes.cover}
                                                image={IntegrationApi}
                                                title="Coming soon"
                                            />
                                            <div className={classes.details}>
                                                <CardContent className={classes.content}>
                                                    <Typography component="h5" variant="h5">
                                                        Coming Soon!
                                                    </Typography>
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
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default connect(null, { push })(withStyles(styles)(populateIntegrationsHOC(IntegrationsNew)));
