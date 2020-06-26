import * as React from 'react';
import { Theme, WithStyles, Hidden, Drawer, createStyles, withStyles, List, ListItem, ListItemText, Typography, Badge, Paper } from '@material-ui/core';
import ScrollTop from '../ScrollTop';
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
import Observer, { InView } from 'react-intersection-observer';
import ExpandMore from '@material-ui/icons/ExpandMore';
const HashLink = require('react-router-hash-link');

const styles = (theme: Theme) =>
    createStyles({
        parallaxContainer: {
            position: 'absolute',
            top: theme.spacing(8),
            height: `calc(100% - ${theme.spacing(8)}px)`,
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: `calc(100% - ${theme.drawer.width}px)`,
                marginLeft: theme.drawer.width,
            },
        },
        mobileSectionMenu: {
            background: 'white',
        },
        drawer: {
            [theme.breakpoints.up('md')]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            border: 'none',
            [theme.breakpoints.up('md')]: {
                zIndex: theme.zIndex.appBar - 1,
                width: theme.drawer.width,
            },
        },
        content: {
            flexGrow: 1,
        },
        iconAlign: {
            verticalAlign: 'middle',
        },
        badge: {
            height: '100%',
            right: '-25px',
        },
        badgeTypography: {
            lineHeight: 'inherit',
        },
        section: {
            padding: theme.spacing(4),
        },
    });

interface DocumentationProps extends WithStyles<typeof styles> {
    theme: Theme;
}

interface DocumentationState {
    currentSelection: string;
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
        currentSelection: '',
        mobileSectionName: 'Getting Started',
    };

    handleMenuToggle = (name: string) => {
        const currentSelection = this.state.currentSelection === name ? '' : name;
        this.setState({ currentSelection: currentSelection });
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
                    id="permissions"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        this.parallax.scrollTo(1);
                    }}
                >
                    <ListItemText primary="Permissions" />
                </ListItem>
                <ListItem
                    id="projects"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        this.parallax.scrollTo(2);
                    }}
                >
                    <ListItemText primary="Projects" />
                </ListItem>
                <ListItem
                    id="geofences"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        this.parallax.scrollTo(3);
                    }}
                >
                    <ListItemText primary="Geofences" />
                </ListItem>
                <ListItem
                    id="integrations"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        this.parallax.scrollTo(4);
                    }}
                >
                    <ListItemText primary="Integrations" />
                </ListItem>
                <ListItem
                    id="api"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        this.parallax.scrollTo(5);
                    }}
                >
                    <ListItemText primary="API" />
                </ListItem>
                <ListItem
                    id="skd"
                    button
                    // onClick={() => {
                    //     this.closeMobileDrawer();
                    //     this.parallax.scrollTo(6);
                    // }}
                >
                    <Badge
                        classes={{ badge: classes.badge }}
                        badgeContent={
                            <Typography className={classes.badgeTypography} variant="caption" align="center">
                                Coming soon
                            </Typography>
                        }
                        color="primary"
                    >
                        <ListItemText primary="SDK" />
                    </Badge>
                </ListItem>
            </List>
        );
        return (
            <React.Fragment>
                <nav>
                    <Hidden mdUp implementation="css">
                        <Drawer
                            variant="temporary"
                            anchor={'top'}
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
                            anchor={'left'}
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
                            pages={6}
                            scrolling={true}
                            ref={(ref: Parallax) => {
                                this.parallax = ref;
                            }}
                        >
                            <ParallaxLayer offset={0} speed={1}>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: 'Getting Started' });
                                    }}
                                >
                                    <section id="getting-started">
                                        <Paper className={classes.section}>
                                            <Typography variant="h5">Getting Started</Typography>
                                            <GettingStarted />
                                            <Observer onChange={this.handleScrollTop}>
                                                <div />
                                            </Observer>
                                        </Paper>
                                    </section>
                                </Observer>
                            </ParallaxLayer>
                            <ParallaxLayer offset={1} speed={1}>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: 'Permissions' });
                                    }}
                                >
                                    <section id="permissions">
                                        <Typography variant="h5">Permissions</Typography>
                                    </section>
                                </Observer>
                            </ParallaxLayer>
                            <ParallaxLayer offset={2} speed={1}>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: 'Projects' });
                                    }}
                                >
                                    <section id="projects">
                                        <Typography variant="h5">Projects</Typography>
                                    </section>
                                </Observer>
                            </ParallaxLayer>
                            <ParallaxLayer offset={3} speed={1}>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: 'Geofences' });
                                    }}
                                >
                                    <section id="geofences">
                                        <Typography variant="h5">Geofences</Typography>
                                    </section>
                                </Observer>
                            </ParallaxLayer>
                            <ParallaxLayer offset={4} speed={1}>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: 'Integrations' });
                                    }}
                                >
                                    <section id="integrations">
                                        <Typography variant="h5">Integrations</Typography>
                                    </section>
                                </Observer>
                            </ParallaxLayer>
                            <ParallaxLayer offset={5} speed={1}>
                                <Observer
                                    onChange={() => {
                                        this.setState({ mobileSectionName: 'API' });
                                    }}
                                >
                                    <section id="api">
                                        <Typography variant="h5">API</Typography>
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
