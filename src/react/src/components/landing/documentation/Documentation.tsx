import * as React from "react";
import {
    Theme,
    WithStyles,
    Hidden,
    Drawer,
    createStyles,
    withStyles,
    List,
    Fade,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    AppBar,
    Toolbar,
    Typography,
} from "@material-ui/core";
import ScrollTop from "../ScrollTop";
import { Parallax, ParallaxLayer } from "react-spring/renderprops-addons";
import Observer from "react-intersection-observer";
import RoutePaths from "../../RoutePaths";
import ExpandLess from "@material-ui/icons/ExpandLess";
const classNames = require("classnames").default;

const styles = (theme: Theme) =>
    createStyles({
        parallaxContainer: {
            position: "absolute",
            top: theme.toolbar.height,
            height: `calc(100% - ${theme.toolbar.height}px)`,
            width: "100%",
        },
        appBarOpaque: {
            background: "white",
        },
        drawer: {
            [theme.breakpoints.up("md")]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: theme.drawer.width,
            zIndex: theme.zIndex.appBar - 1,
            border: "none",
        },
    });

interface DocumentationProps extends WithStyles<typeof styles> {
    mobileOpen: boolean;
    theme: Theme;
}

interface DocumentationState {
    expandedSection: string;
    mobileOpen: boolean;
    atPageTop: boolean;
}

const timeout = { enter: 0, exit: 500 };

class Documentation extends React.Component<DocumentationProps, DocumentationState> {
    parallax: React.RefObject<Parallax>;

    state: DocumentationState = {
        mobileOpen: false,
        atPageTop: true,
        expandedSection: "",
    };

    handleMenuToggle = (name: string) => {
        const expandedSection = this.state.expandedSection === name ? "" : name;
        this.setState({ expandedSection: expandedSection });
    };

    handleMenuNavigation = (section: string) => {};

    handleIntersectionChange = (inView: boolean) => {
        this.setState({ atPageTop: inView });
    };

    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <div>
                <div className={classes.toolbar} />
                <List>
                    <ListItem id="getting-started" button onClick={() => this.handleMenuNavigation(RoutePaths.Home)}>
                        <ListItemText primary="Getting Started" />
                    </ListItem>

                    <ListItem id="geofences" button onClick={() => this.handleMenuToggle("geofences")}>
                        <ListItemText primary="Geofences" />
                        <Fade in={this.state.expandedSection === "geofences"} timeout={timeout}>
                            <ExpandLess />
                        </Fade>
                    </ListItem>
                    <Collapse in={this.state.expandedSection === "geofences"} timeout={500} unmountOnExit>
                        <List disablePadding>
                            <ListItem button onClick={() => this.handleMenuNavigation(RoutePaths.GeoFenceMap)}>
                                <ListItemText inset primary="Map" />
                            </ListItem>
                            <ListItem button onClick={() => this.handleMenuNavigation(RoutePaths.GeoFenceTable)}>
                                <ListItemText inset primary="Table" />
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem id="integrations" button onClick={() => this.handleMenuToggle("integrations")}>
                        <ListItemText primary="Integrations" />
                        <Fade in={this.state.expandedSection === "integrations"} timeout={timeout}>
                            <ExpandLess />
                        </Fade>
                    </ListItem>
                    <Collapse in={this.state.expandedSection === "integrations"} timeout={500} unmountOnExit>
                        <List disablePadding>
                            <ListItem button onClick={() => this.handleMenuNavigation(RoutePaths.GeoFenceMap)}>
                                <ListItemText inset primary="" />
                            </ListItem>
                            <ListItem button onClick={() => this.handleMenuNavigation(RoutePaths.GeoFenceTable)}>
                                <ListItemText inset primary="" />
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </div>
        );
        return (
            <React.Fragment>
                <nav>
                    <Hidden mdUp implementation="css">
                        <AppBar elevation={0} position="fixed" className={classes.appBarOpaque}>
                            <Toolbar></Toolbar>
                        </AppBar>
                    </Hidden>
                    <Hidden mdUp implementation="css">
                        <Drawer
                            variant="temporary"
                            anchor={"top"}
                            open={this.props.mobileOpen}
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

                <div className={classes.parallaxContainer}>
                    <Parallax pages={3} scrolling={true} ref={this.parallax}>
                        <ParallaxLayer offset={0} speed={1}>
                            <Observer onChange={this.handleIntersectionChange}>
                                <div />
                            </Observer>
                            <section id="getting-started">
                                <Typography variant="h4">Getting Started</Typography>
                            </section>
                        </ParallaxLayer>
                        <ParallaxLayer offset={1} speed={1}>
                            <section id="geofences">
                                <Typography variant="h4">Geofences</Typography>
                            </section>
                        </ParallaxLayer>
                        <ParallaxLayer offset={2} speed={1}>
                            <section id="integrations">
                                <Typography variant="h4">Integrations</Typography>
                            </section>
                        </ParallaxLayer>
                    </Parallax>
                    <ScrollTop
                        visible={!this.state.atPageTop}
                        onClick={() => {
                            this.parallax.current.scrollTo(0);
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Documentation);
