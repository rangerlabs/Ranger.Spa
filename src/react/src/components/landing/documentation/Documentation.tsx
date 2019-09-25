import * as React from "react";
import { Theme, WithStyles, Hidden, Drawer, createStyles, withStyles, List, Fade, ListItem, ListItemText, Collapse, Typography } from "@material-ui/core";
import ScrollTop from "../ScrollTop";
import { Parallax, ParallaxLayer } from "react-spring/renderprops-addons";
import Observer, { InView } from "react-intersection-observer";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
const classNames = require("classnames").default;

const styles = (theme: Theme) =>
    createStyles({
        parallaxContainer: {
            position: "absolute",
            top: theme.toolbar.height,
            height: `calc(100% - ${theme.toolbar.height}px)`,
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${theme.drawer.width}px)`,
                marginLeft: theme.drawer.width,
            },
        },
        mobileSectionMenu: {
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
            border: "none",
            [theme.breakpoints.up("md")]: {
                zIndex: theme.zIndex.appBar - 1,
                width: theme.drawer.width,
            },
        },
        content: {
            flexGrow: 1,
        },
        iconAlign: {
            verticalAlign: "middle",
        },
    });

interface DocumentationProps extends WithStyles<typeof styles> {
    theme: Theme;
}

interface DocumentationState {
    expandedSection: string;
    mobileSectionName: string;
    mobileOpen: boolean;
    atPageTop: boolean;
}

const timeout = { enter: 0, exit: 500 };

class Documentation extends React.Component<DocumentationProps, DocumentationState> {
    parallax: Parallax;

    state: DocumentationState = {
        mobileOpen: false,
        atPageTop: true,
        expandedSection: "",
        mobileSectionName: "Getting Started",
    };

    handleMenuToggle = (name: string) => {
        const expandedSection = this.state.expandedSection === name ? "" : name;
        this.setState({ expandedSection: expandedSection });
    };

    openMobileDrawer = () => {
        this.setState({
            mobileOpen: true,
        });
    };
    closeMobileDrawer = () => {
        this.setState({
            mobileOpen: false,
        });
    };
    handleScrollTop = (inView: boolean) => {
        this.setState({ atPageTop: inView });
    };

    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <List>
                <ListItem
                    id="getting-started"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        this.parallax.scrollTo(0);
                    }}
                >
                    <ListItemText primary="Getting Started" />
                </ListItem>

                <ListItem
                    id="geofences"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        this.parallax.scrollTo(1);
                    }}
                >
                    <ListItemText primary="Geofences" />
                </ListItem>
                <ListItem
                    id="integrations"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        this.parallax.scrollTo(2);
                    }}
                >
                    <ListItemText primary="Integrations" />
                </ListItem>
            </List>
        );
        return (
            <React.Fragment>
                <nav>
                    <Hidden mdUp implementation="css">
                        <Drawer
                            variant="temporary"
                            anchor={"top"}
                            open={this.state.mobileOpen}
                            onClose={this.closeMobileDrawer}
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
                            <div>
                                <div className={classes.toolbar} />
                                {drawerContent}
                            </div>
                        </Drawer>
                    </Hidden>
                </nav>

                <div className={classes.content}>
                    <div className={classes.parallaxContainer}>
                        <Hidden mdUp implementation="css">
                            <div className={classes.mobileSectionMenu} onClick={this.openMobileDrawer}>
                                <Typography align="center" variant="subtitle1">
                                    {this.state.mobileSectionName}
                                    <ExpandMore className={classes.iconAlign} />
                                </Typography>
                            </div>
                        </Hidden>
                        <Parallax
                            pages={3}
                            scrolling={true}
                            ref={(ref: Parallax) => {
                                this.parallax = ref;
                            }}
                        >
                            <ParallaxLayer offset={0} speed={1}>
                                <Observer onChange={this.handleScrollTop}>
                                    <div />
                                </Observer>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: "Getting Started" });
                                    }}
                                >
                                    <section id="getting-started">
                                        <Typography variant="h5">Getting Started</Typography>
                                    </section>
                                </Observer>
                            </ParallaxLayer>
                            <ParallaxLayer offset={1} speed={1}>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: "Geofences" });
                                    }}
                                >
                                    <section id="geofences">
                                        <Typography variant="h5">Geofences</Typography>
                                    </section>
                                </Observer>
                            </ParallaxLayer>
                            <ParallaxLayer offset={2} speed={1}>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: "Integrations" });
                                    }}
                                >
                                    <section id="integrations">
                                        <Typography variant="h5">Integrations</Typography>
                                    </section>
                                </Observer>
                            </ParallaxLayer>
                        </Parallax>
                        <ScrollTop
                            visible={!this.state.atPageTop}
                            onClick={() => {
                                this.parallax.scrollTo(0);
                            }}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Documentation);
