import * as React from "react";
import { selectApp } from "../../../redux/actions/SelectedAppActions";
import { Theme, createStyles, WithStyles, withStyles, Card, CardHeader, CardContent, Typography, CardMedia, Grid, ButtonBase } from "@material-ui/core";
import { connect } from "react-redux";
import IApp from "../../../models/app/IApp";
import { ApplicationState } from "../../../stores";
import { push } from "connected-react-router";
import RoutePaths from "../../RoutePaths";
const IntegrationApi = require("../../../../assets/integration-api.png");
import * as queryString from "query-string";
import { Parallax, ParallaxLayer } from "react-spring/renderprops-addons";

const styles = (theme: Theme) =>
    createStyles({
        card: {
            flexGrow: 1,
            height: "100%",
        },
        buttons: {
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 0,
        },
        media: {
            height: 0,
            paddingTop: "96px",
        },
        layout: {
            margin: theme.spacing(2),
        },
        parallaxContainer: {
            position: "absolute",
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${theme.drawer.width}px - ${theme.spacing(4)}px)`,
            },
            height: "100%",
        },
        mediaRoot: {
            backgroundSize: "contain",
        },
        rootPadding: {
            padding: theme.spacing(1),
        },
        gridButton: {
            width: "100% !important",
        },
    });

interface AppsSelectProps extends WithStyles<typeof styles> {
    apps: IApp[];
    selectApp: (appName: string) => void;
    push: typeof push;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        apps: state.apps,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        selectApp: (appName: string) => {
            const action = selectApp(appName);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class AppsSelect extends React.Component<AppsSelectProps> {
    getRedirectFromParams(): string {
        const params = queryString.parse(window.location.search);
        const redirect = params["redirect"] as string;
        return redirect;
    }

    handleAppClick(appName: string) {
        this.props.selectApp(appName);
        const redirect = this.getRedirectFromParams();
        if (redirect) {
            this.props.push("/" + appName + redirect);
        } else {
            this.props.push(RoutePaths.GeoFenceMap.replace(":appName", appName));
        }
    }

    render() {
        const { classes, apps } = this.props;
        return (
            <React.Fragment>
                <div className={classes.layout}>
                    <Typography gutterBottom variant="h5" align="center">
                        Select one of your applications to continue.
                    </Typography>
                    <div className={classes.parallaxContainer}>
                        <Parallax pages={2} scrolling={true}>
                            <ParallaxLayer speed={0.7}>
                                <Grid container spacing={3} direction="row" justify="center" alignItems="baseline">
                                    {apps.map(app => (
                                        <Grid key={app.name} item xs={12} sm={8} md={7}>
                                            <ButtonBase
                                                className={classes.gridButton}
                                                onClick={() => {
                                                    this.handleAppClick(app.name);
                                                }}
                                            >
                                                <Card elevation={3} className={classes.card}>
                                                    <CardHeader
                                                        titleTypographyProps={{ align: "left" }}
                                                        classes={{ root: classes.rootPadding }}
                                                        title={app.name}
                                                    />
                                                    <CardMedia
                                                        classes={{ root: classes.mediaRoot }}
                                                        className={classes.media}
                                                        image={IntegrationApi}
                                                        title="Api Integration"
                                                    />
                                                    <CardContent classes={{ root: classes.rootPadding }}>
                                                        <Typography align="left" component="p">
                                                            {app.description}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </ButtonBase>
                                        </Grid>
                                    ))}
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
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AppsSelect));
