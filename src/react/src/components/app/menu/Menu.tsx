import * as React from "react";
import {
    Drawer,
    withStyles,
    Theme,
    createStyles,
    WithStyles,
    List,
    ListItemText,
    Divider,
    Hidden,
    ListItem,
    ListItemIcon,
    Typography,
    Collapse,
    Fade,
    Grid,
} from "@material-ui/core";
import People from "@material-ui/icons/People";
import Home from "@material-ui/icons/Home";
import GpsFixed from "@material-ui/icons/GpsFixed";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExpandLess from "@material-ui/icons/ExpandLess";
import Lock from "@material-ui/icons/Lock";
import Equalizer from "@material-ui/icons/Equalizer";
import SpeakerPhone from "@material-ui/icons/SpeakerPhone";
import FormatListBulleted from "@material-ui/icons/FormatListBulleted";
import Web from "mdi-material-ui/Web";
import FileImport from "mdi-material-ui/FileImport";
import MapLegend from "mdi-material-ui/MapLegend";
import ArrowDecision from "mdi-material-ui/ArrowDecision";
import Plus from "mdi-material-ui/Plus";
import MapPlus from "mdi-material-ui/MapPlus";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { ApplicationState } from "../../../stores";
import { expandSection } from "../../../redux/actions/MenuActions";
import { UserProfile } from "../../../models/UserProfile";
import { RoleEnum } from "../../../models/RoleEnum";
import RoutePaths from "../../../components/RoutePaths";
import { User } from "oidc-client";
import Logo from "../../../theme/Logo";
const classNames = require("classnames").default;

const styles = (theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up("md")]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        drawerPaper: {
            width: theme.drawer.width,
            // backgroundImage: "linear-gradient(-135deg, #b230ae 80%, #E94057 30%, #F27121 0%)",
            // backgroundImage: "linear-gradient(45deg, #ff7847 1%,#cc39cc 51%,#7e57c2 100%)",
            backgroundImage: "linear-gradient(45deg, rgba(204,153,204,1) 0%,rgba(126,87,194,1) 100%)",
            backgroundSize: "cover",
            // backgroundPosition: "center center",
            // "&::before": {
            //     width: "100%",
            //     height: "100%",
            //     content: "''",
            //     display: "block",
            //     opacity: 0.1,
            //     position: "absolute",
            //     background: "#000000",
            // },
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        logo: {
            ...theme.mixins.toolbar,
        },
        divider: {
            position: "relative",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            margin: "auto",
            width: "90%",
        },
        listItemHover: {
            height: theme.toolbar.height,
            "&:hover": {
                backgroundColor: theme.palette.primary.main,
            },
        },
        menuButton: {
            margin: "auto",
            width: "70%",
        },
        menuItemTextColor: {
            color: theme.drawer.text.color,
        },
    });
interface MenuProps extends WithStyles<typeof styles> {
    theme: Theme;
    user: User;
    selectedApp: string;
    mobileOpen: boolean;
    signOut: () => void;
    handleDrawerToggle: () => void;
    push: typeof push;
    expandedSection: string;
    dispatchExpandSection: (section: string) => void;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedApp: state.selectedApp,
        user: state.oidc.user,
        expandedSection: state.menu.expandedSection,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatchExpandSection: (section: string) => {
            const action = expandSection({ expandedSection: section });
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

const timeout = { enter: 0, exit: 500 };

class Menu extends React.Component<MenuProps> {
    handleMenuToggle = (name: string) => {
        const expandedSection = this.props.expandedSection === name ? "" : name;
        this.props.dispatchExpandSection(expandedSection);
    };

    handleMenuNavigation = (path: string) => {
        let pushPath = path;
        if (this.props.selectedApp) {
            pushPath = path.replace(":appName", this.props.selectedApp);
        }
        this.props.push(pushPath);
    };

    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <div>
                <Grid container direction="column" justify="center" alignItems="center" className={classes.logo}>
                    <Grid item>
                        <Logo />
                        <Typography className={classes.menuItemTextColor} align="center" variant="h5">
                            Ranger
                        </Typography>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <List>
                    <ListItem id="home" classes={{ button: classes.listItemHover }} button onClick={() => this.handleMenuNavigation(RoutePaths.Home)}>
                        <ListItemIcon>
                            <Home htmlColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="Home" classes={{ primary: classes.menuItemTextColor }} />
                    </ListItem>

                    <ListItem id="geofences" classes={{ button: classes.listItemHover }} button onClick={() => this.handleMenuToggle("geofences")}>
                        <ListItemIcon>
                            <GpsFixed htmlColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="Geo-fences" classes={{ primary: classes.menuItemTextColor }} />
                        <Fade in={this.props.expandedSection === "geofences"} timeout={timeout}>
                            <ExpandLess htmlColor={theme.drawer.text.color} />
                        </Fade>
                    </ListItem>
                    <Collapse in={this.props.expandedSection === "geofences"} timeout={500} unmountOnExit>
                        <List disablePadding>
                            <ListItem
                                button
                                className={classNames(classes.listItemHover, classes.nested)}
                                onClick={() => this.handleMenuNavigation(RoutePaths.GeoFenceMap)}
                            >
                                <ListItemIcon>
                                    <MapPlus htmlColor={theme.drawer.text.color} />
                                </ListItemIcon>
                                <ListItemText inset primary="Map" classes={{ primary: classes.menuItemTextColor }} />
                            </ListItem>
                            <ListItem
                                button
                                className={classNames(classes.listItemHover, classes.nested)}
                                onClick={() => this.handleMenuNavigation(RoutePaths.GeoFenceTable)}
                            >
                                <ListItemIcon>
                                    <FormatListBulleted htmlColor={theme.drawer.text.color} />
                                </ListItemIcon>
                                <ListItemText inset primary="Table" classes={{ primary: classes.menuItemTextColor }} />
                            </ListItem>
                            {/* <ListItem
                                button
                                className={classNames(classes.listItemHover, classes.nested)}
                                onClick={() => this.handleMenuNavigation("/geofences/import")}
                            >
                                <ListItemIcon>
                                    <FileImport htmlColor={theme.drawer.text.color} />
                                </ListItemIcon>
                                <ListItemText inset primary="Import" classes={{ primary: classes.menuItemTextColor }} />
                            </ListItem> */}
                        </List>
                    </Collapse>

                    <ListItem
                        id="integrations"
                        classes={{ button: classes.listItemHover }}
                        button
                        onClick={() => this.handleMenuNavigation(RoutePaths.Integrations)}
                    >
                        <ListItemIcon>
                            <ArrowDecision htmlColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="Integrations" classes={{ primary: classes.menuItemTextColor }} />
                    </ListItem>

                    <ListItem
                        id="applications"
                        classes={{ button: classes.listItemHover }}
                        button
                        onClick={() => {
                            this.handleMenuNavigation(RoutePaths.Apps);
                        }}
                    >
                        <ListItemIcon>
                            <SpeakerPhone htmlColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="Applications" classes={{ primary: classes.menuItemTextColor }} />
                    </ListItem>
                    {(this.props.user.profile as UserProfile).role.find(r => r.toUpperCase() === RoleEnum.ADMIN) && (
                        <React.Fragment>
                            <ListItem
                                id="administration"
                                classes={{ button: classes.listItemHover }}
                                button
                                onClick={() => this.handleMenuToggle("administration")}
                            >
                                <ListItemIcon>
                                    <Lock htmlColor={theme.drawer.text.color} />
                                </ListItemIcon>
                                <ListItemText primary="Administration" classes={{ primary: classes.menuItemTextColor }} />
                                <Fade in={this.props.expandedSection === "administration"} timeout={timeout}>
                                    <ExpandLess htmlColor={theme.drawer.text.color} />
                                </Fade>
                            </ListItem>
                            <Collapse in={this.props.expandedSection === "administration"} timeout={500} unmountOnExit>
                                <List disablePadding>
                                    <ListItem
                                        button
                                        className={classNames(classes.listItemHover, classes.nested)}
                                        onClick={() => this.handleMenuNavigation(RoutePaths.Users)}
                                    >
                                        <ListItemIcon>
                                            <People htmlColor={theme.drawer.text.color} />
                                        </ListItemIcon>
                                        <ListItemText inset primary="Users" classes={{ primary: classes.menuItemTextColor }} />
                                    </ListItem>

                                    {(this.props.user.profile as UserProfile).role.find(r => r.toUpperCase() === RoleEnum.OWNER) && (
                                        <ListItem
                                            button
                                            className={classNames(classes.listItemHover, classes.nested)}
                                            onClick={() => this.handleMenuNavigation("/domain")}
                                        >
                                            <ListItemIcon>
                                                <Web htmlColor={theme.drawer.text.color} />
                                            </ListItemIcon>
                                            <ListItemText inset primary="Domain" classes={{ primary: classes.menuItemTextColor }} />
                                        </ListItem>
                                    )}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    )}

                    <Hidden mdUp implementation="css">
                        <ListItem id="account" classes={{ button: classes.listItemHover }} button onClick={() => this.handleMenuToggle("account")}>
                            <ListItemIcon>
                                <AccountCircle htmlColor={theme.drawer.text.color} />
                            </ListItemIcon>
                            <ListItemText primary="Account" classes={{ primary: classes.menuItemTextColor }} />
                            <Fade in={this.props.expandedSection === "account"} timeout={timeout}>
                                <ExpandLess htmlColor={theme.drawer.text.color} />
                            </Fade>
                        </ListItem>
                        <Collapse in={this.props.expandedSection === "account"} timeout={500} unmountOnExit>
                            <List disablePadding>
                                <ListItem button className={classNames(classes.listItemHover, classes.nested)} onClick={this.props.signOut}>
                                    <ListItemIcon>
                                        <Lock htmlColor={theme.drawer.text.color} />
                                    </ListItemIcon>
                                    <ListItemText inset primary="Logout" classes={{ primary: classes.menuItemTextColor }} />
                                </ListItem>
                            </List>
                        </Collapse>
                    </Hidden>
                </List>
            </div>
        );

        return (
            <nav className={classes.drawer}>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={"right"}
                        open={this.props.mobileOpen}
                        onClose={this.props.handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        SlideProps={{
                            timeout: { enter: theme.drawer.enterDuration, exit: theme.drawer.leavingDuration },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        anchor={"left"}
                        variant="permanent"
                        open
                    >
                        {drawerContent}
                    </Drawer>
                </Hidden>
            </nav>
        );
    }
}

export default withStyles(styles, { withTheme: true })(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Menu)
);
