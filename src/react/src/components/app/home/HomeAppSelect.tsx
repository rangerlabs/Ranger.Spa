import * as React from "react";
import { selectApp } from "../../../redux/actions/SelectedAppActions";
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
    CardActions,
    IconButton,
    GridList,
    GridListTile,
    Paper,
} from "@material-ui/core";
import ArrowRight from "mdi-material-ui/ArrowRight";
import { connect } from "react-redux";
import IApp from "../../../models/app/IApp";
import { ApplicationState } from "../../../stores";
import { push } from "connected-react-router";
import RoutePaths from "../../RoutePaths";
const IntegrationApi = require("../../../../assets/integration-api.png");

const styles = (theme: Theme) =>
    createStyles({
        card: {
            // height: "100%",
            margin: "10px",
        },
        cardContent: {
            paddingBottom: "0px",
        },
        buttons: {
            display: "flex",
            justifyContent: "flex-end",
            padding: "0px",
        },
        media: {
            height: 0,
            paddingTop: "64px",
        },
        layout: {
            width: "auto",
            margin: theme.spacing(2),
        },
        mediaRoot: {
            backgroundSize: "contain",
        },
        root: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            overflow: "hidden",
            width: "100%",
            // backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: "100%",
            flexWrap: "nowrap",
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: "translateZ(0)",
        },
        gridListTile: {
            height: "100% !important",
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

class HomeAppSelect extends React.Component<AppsSelectProps> {
    handleAppClick(appName: string) {
        this.props.selectApp(appName);
        this.props.push(RoutePaths.GeoFenceMap);
    }
    render() {
        const { classes, apps } = this.props;
        return (
            <React.Fragment>
                <Typography align="left" variant="subtitle1">
                    Applications
                </Typography>
                <div className={classes.root}>
                    <GridList className={classes.gridList} cols={2.5}>
                        {apps.map(app => (
                            <GridListTile className={classes.gridListTile} key={app.name}>
                                <Card className={classes.card}>
                                    <CardHeader title={app.name} />
                                    <CardMedia classes={{ root: classes.mediaRoot }} className={classes.media} image={IntegrationApi} title="Api Integration" />
                                    <CardContent classes={{ root: classes.cardContent }}>
                                        <Typography component="p">{app.description}</Typography>
                                    </CardContent>
                                    <CardActions className={classes.buttons}>
                                        <IconButton
                                            onClick={() => {
                                                this.handleAppClick(app.name);
                                            }}
                                            aria-label="Select app"
                                        >
                                            <ArrowRight color="primary" />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(HomeAppSelect));
