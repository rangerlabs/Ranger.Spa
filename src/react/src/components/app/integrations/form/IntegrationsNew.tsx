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
    ButtonBase,
} from "@material-ui/core";
import ArrowRight from "mdi-material-ui/ArrowRight";
import requireAppSelection from "../../hocs/RequireAppSelectionHOC";
import RoutePaths from "../../../RoutePaths";
import { push } from "connected-react-router";
import { IntegrationEnum } from "../../../../models/app/integrations/IntegrationEnum";
import { connect } from "react-redux";
import { Parallax, ParallaxLayer } from "react-spring/renderprops-addons";
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
        parallaxContainer: {
            position: "absolute",
            width: `calc(100% - ${theme.drawer.width}px)`,
            height: "100%",
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
                    <div className={classes.parallaxContainer}>
                        <Parallax pages={1} scrolling={true}>
                            <ParallaxLayer offset={0} speed={0.7}>
                                <Grid container spacing={3} direction="row" justify="center" alignItems="flex-start">
                                    <Grid item xs={12} sm={8} md={7}>
                                        <ButtonBase
                                            onClick={() => {
                                                this.handleIntegrationSelect(IntegrationEnum.API);
                                            }}
                                        >
                                            <Card className={classes.card}>
                                                <CardHeader title="API" />
                                                <CardMedia
                                                    classes={{ root: classes.mediaRoot }}
                                                    className={classes.media}
                                                    image={IntegrationApi}
                                                    title="Api Integration"
                                                />
                                                <CardContent>
                                                    <Typography component="p">Forward geofence events to any REST API of your choosing.</Typography>
                                                </CardContent>
                                            </Card>
                                        </ButtonBase>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <ButtonBase
                                            onClick={() => {
                                                this.handleIntegrationSelect(IntegrationEnum.API);
                                            }}
                                        >
                                            <Card className={classes.card}>
                                                <CardHeader title="Coming soon..." />
                                                <CardMedia
                                                    classes={{ root: classes.mediaRoot }}
                                                    className={classes.media}
                                                    image={IntegrationApi}
                                                    title="Api Integration"
                                                />
                                                <CardContent>
                                                    <Typography component="p">
                                                        We're striving to bring you as many integrations as possible. Drop us a line to request your most sought
                                                        after integrations.
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

export default connect(
    null,
    { push }
)(withStyles(styles)(requireAppSelection(IntegrationsNew)));
