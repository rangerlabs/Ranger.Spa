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
    Grid,
    CardActions,
    IconButton,
} from "@material-ui/core";
import ArrowRight from "mdi-material-ui/ArrowRight";
import { connect } from "react-redux";
import IApp from "../../../models/app/IApp";
import { ApplicationState } from "../../../stores";
import { push } from "connected-react-router";
import RoutePaths from "../../RoutePaths";
const IntegrationApi = require("../../../../assets/integration-api.png");
import * as queryString from "query-string";

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
            margin: theme.spacing.unit * 2,
        },
        mediaRoot: {
            backgroundSize: "contain",
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
                        Select an application to continue.
                    </Typography>
                    <Grid container spacing={24}>
                        {apps.map(app => (
                            <Grid key={app.name} item xs={12} sm={apps.length >= 3 ? 6 : 12} md={apps.length >= 3 ? 4 : 6}>
                                <Card className={classes.card}>
                                    <CardHeader title={app.name} />
                                    <CardMedia classes={{ root: classes.mediaRoot }} className={classes.media} image={IntegrationApi} title="Api Integration" />
                                    <CardContent>
                                        <Typography component="p">{app.description}</Typography>
                                    </CardContent>
                                    <CardActions className={classes.buttons}>
                                        <IconButton
                                            onClick={() => {
                                                this.handleAppClick(app.name);
                                            }}
                                            aria-label="Add to integrations"
                                        >
                                            <ArrowRight color="primary" />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AppsSelect));
