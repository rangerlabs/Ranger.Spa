import * as React from "react";
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
    CardActions,
    IconButton,
} from "@material-ui/core";
import ArrowRight from "mdi-material-ui/ArrowRight";
import requireAppSelection from "../../hocs/RequireAppSelectionHOC";
import RoutePaths from "../../../RoutePaths";
import { push } from "connected-react-router";
import { IntegrationEnum } from "../../../../models/app/integrations/IntegrationEnum";
import { connect } from "react-redux";
const IntegrationApi = require("../../../../../assets/integration-api.png");

const styles = (theme: Theme) =>
    createStyles({
        card: {
            height: "100%",
        },
        buttons: {
            display: "flex",
            justifyContent: "flex-end",
        },
        media: {
            height: 0,
            paddingTop: "128px",
        },
        layout: {
            width: "auto",
            margin: theme.spacing(2),
        },
        mediaRoot: {
            backgroundSize: "contain",
        },
    });

interface IntegrationsSelectProps extends WithStyles<typeof styles> {
    push: typeof push;
}

class IntegrationsNew extends React.Component<IntegrationsSelectProps> {
    handleIntegrationSelect = (integrationType: IntegrationEnum) => {
        switch (integrationType) {
            case IntegrationEnum.API: {
                this.props.push(RoutePaths.IntegrationsNewApi);
                break;
            }
            case IntegrationEnum.PUSHER: {
                this.props.push(RoutePaths.IntegrationsNewPusher);
                break;
            }
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.layout}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardHeader title="API" />
                                <CardMedia classes={{ root: classes.mediaRoot }} className={classes.media} image={IntegrationApi} title="Api Integration" />
                                <CardContent>
                                    <Typography component="p">Forward geo-fence events to any REST API of your choosing.</Typography>
                                </CardContent>
                                <CardActions className={classes.buttons}>
                                    <IconButton
                                        aria-label="Add API integration"
                                        onClick={() => {
                                            this.handleIntegrationSelect(IntegrationEnum.API);
                                        }}
                                    >
                                        <ArrowRight color="primary" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardHeader title="Pusher" />
                                <CardMedia classes={{ root: classes.mediaRoot }} className={classes.media} image={IntegrationApi} title="Api Integration" />
                                <CardContent>
                                    <Typography component="p">Forward geo-fence events to Pusher Channels.</Typography>
                                </CardContent>
                                <CardActions className={classes.buttons}>
                                    <IconButton
                                        aria-label="Add Pusher integration"
                                        onClick={() => {
                                            this.handleIntegrationSelect(IntegrationEnum.PUSHER);
                                        }}
                                    >
                                        <ArrowRight color="primary" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardHeader title="Pub-Nub" />
                                <CardMedia classes={{ root: classes.mediaRoot }} className={classes.media} image={IntegrationApi} title="Api Integration" />
                                <CardContent>
                                    <Typography component="p">Forward geo-fence events to Pub-Nub.</Typography>
                                </CardContent>
                                <CardActions className={classes.buttons}>
                                    <IconButton
                                        aria-label="Add PubNub integration"
                                        onClick={() => {
                                            this.handleIntegrationSelect(IntegrationEnum.PUBNUB);
                                        }}
                                    >
                                        <ArrowRight color="primary" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardHeader title="Coming soon..." />
                                <CardMedia classes={{ root: classes.mediaRoot }} className={classes.media} image={IntegrationApi} title="Api Integration" />
                                <CardContent>
                                    <Typography component="p">
                                        We're striving to bring you as many integrations as possible. Drop us a line to request your most sought after
                                        integrations.
                                    </Typography>
                                </CardContent>
                                <CardActions className={classes.buttons}>
                                    <IconButton disabled aria-label="Add to integrations">
                                        <ArrowRight color="primary" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    null,
    { push }
)(withStyles(styles)(requireAppSelection(IntegrationsNew)));
