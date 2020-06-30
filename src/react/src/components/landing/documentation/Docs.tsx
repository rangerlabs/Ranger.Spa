import * as React from 'react';
import { Theme, WithStyles, Hidden, Drawer, createStyles, withStyles, List, ListItem, ListItemText, Typography, Badge, Paper } from '@material-ui/core';
import ScrollTop from '../ScrollTop';
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
import Observer, { InView } from 'react-intersection-observer';
import ExpandMore from '@material-ui/icons/ExpandMore';
import GettingStarted from './GettingStarted';
import Constants from '../../../theme/Constants';
import { DocComponents } from './DocumentationComponents';
import { Switch, RouteComponentProps, Route } from 'react-router-dom';
import NotFound from '../../error/NotFound';

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
            background: '#fafafa',
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
        paper: {
            padding: theme.spacing(4),
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(3),
            [theme.breakpoints.up(800 + theme.spacing(2 * 2))]: {
                width: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
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

class Docs extends React.Component<DocumentationProps, DocumentationState> {
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
        const docComponents = DocComponents;

        const drawerContent = (
            <List>
                <ListItem
                    id="getting-started-link"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        document.getElementById('getting-started').scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ListItemText primary="Getting Started" />
                </ListItem>
                <ListItem
                    id="permissions-link"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        document.getElementById('permissions').scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ListItemText primary="Permissions" />
                </ListItem>
                <ListItem
                    id="projects-link"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ListItemText primary="Projects" />
                </ListItem>
                <ListItem
                    id="geofences-link"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        document.getElementById('geofences').scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ListItemText primary="Geofences" />
                </ListItem>
                <ListItem
                    id="integrations-link"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        document.getElementById('integrations').scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ListItemText primary="Integrations" />
                </ListItem>
                <ListItem
                    id="api-link"
                    button
                    onClick={() => {
                        this.closeMobileDrawer();
                        document.getElementById('api').scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <ListItemText primary="API" />
                </ListItem>
                <ListItem
                    id="sdk-link"
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
                    <Hidden mdUp implementation="css">
                        <div className={classes.mobileSectionMenu} onClick={this.openMobileDrawer}>
                            <Typography align="center" variant="subtitle1">
                                {this.state.mobileSectionName}
                                <ExpandMore className={classes.iconAlign} />
                            </Typography>
                        </div>
                    </Hidden>

                    <Observer
                        onChange={() => {
                            this.setState({ mobileSectionName: 'Getting Started' });
                        }}
                    >
                        <section id="getting-started">
                            <Paper elevation={3} className={classes.paper}>
                                <Observer onChange={this.handleScrollTop}>
                                    <div />
                                </Observer>
                                {docComponents.map((props, index) => {
                                    const { component: Component, ...rest } = props;
                                    return <Route {...rest} render={(props) => <Component key={index} {...props} />} />;
                                })}
                                <Route component={NotFound} />
                            </Paper>
                        </section>
                    </Observer>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Docs);
