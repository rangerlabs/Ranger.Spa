import * as React from 'react';
import {
    Drawer,
    withStyles,
    Theme,
    createStyles,
    WithStyles,
    List,
    ListItemText,
    Hidden,
    ListItem,
    ListItemIcon,
    Typography,
    Collapse,
    Fade,
    Button,
    Badge,
} from '@material-ui/core';
import People from '@material-ui/icons/People';
import MapMarker from 'mdi-material-ui/MapMarker';
import ViewDashboard from 'mdi-material-ui/ViewDashboardOutline';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Lock from '@material-ui/icons/Lock';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import Domain from 'mdi-material-ui/Domain';
import ArrowDecision from 'mdi-material-ui/ArrowDecision';
import Map from 'mdi-material-ui/Map';
import HexagonMultiple from 'mdi-material-ui/HexagonMultiple';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { ApplicationState } from '../../../stores';
import { expandSection } from '../../../redux/actions/MenuActions';
import { RoleEnum } from '../../../models/RoleEnum';
import RoutePaths from '../../../components/RoutePaths';
import { User } from 'oidc-client';
import IProject from '../../../models/app/IProject';
import { userIsInRole } from '../../../helpers/Helpers';
import Logout from 'mdi-material-ui/Logout';
import CreditCard from 'mdi-material-ui/CreditCard';
import MapMarkerPath from 'mdi-material-ui/MapMarkerPath';
import Settings from 'mdi-material-ui/Settings';

const styles = (theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up('md')]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        drawerPaper: {
            width: theme.drawer.width,
        },
        headerPush: {
            ...theme.mixins.toolbar,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        logoButtonRoot: {
            '&:hover': {
                background: 'none',
            },
        },
        badge: {
            height: '100%',
            right: '-25px',
        },
        badgeTypography: {
            lineHeight: 'inherit',
        },
    });
interface MenuProps extends WithStyles<typeof styles> {
    theme: Theme;
    user: User;
    selectedProject: IProject;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    push: typeof push;
    expandedSection: string;
    dispatchExpandSection: (section: string) => void;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedProject: state.selectedProject,
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
        const expandedSection = this.props.expandedSection === name ? '' : name;
        this.props.dispatchExpandSection(expandedSection);
    };

    handleMenuNavigation = (path: string) => {
        let pushPath = path;
        if (this.props.selectedProject.name) {
            pushPath = path.replace(':appName', this.props.selectedProject.name);
        }
        this.props.push(pushPath);
    };

    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <List>
                <ListItem id="home" button onClick={() => this.handleMenuNavigation(RoutePaths.Dashboard)}>
                    <ListItemIcon>
                        <ViewDashboard />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem id="geofences" button onClick={() => this.handleMenuToggle('geofences')}>
                    <ListItemIcon>
                        <MapMarker />
                    </ListItemIcon>
                    <ListItemText primary="Geofences" />
                    <Fade in={this.props.expandedSection === 'geofences'} timeout={timeout}>
                        <ExpandLess />
                    </Fade>
                </ListItem>
                <Collapse in={this.props.expandedSection === 'geofences'} timeout={500} unmountOnExit>
                    <List disablePadding>
                        <ListItem button className={classes.nested} onClick={() => this.handleMenuNavigation(RoutePaths.GeofenceMap)}>
                            <ListItemIcon>
                                <Map />
                            </ListItemIcon>
                            <ListItemText primary="Map" />
                        </ListItem>
                        <ListItem button className={classes.nested} onClick={() => this.handleMenuNavigation(RoutePaths.GeofenceTable)}>
                            <ListItemIcon>
                                <FormatListBulleted />
                            </ListItemIcon>
                            <ListItemText primary="Table" />
                        </ListItem>
                    </List>
                </Collapse>

                <ListItem id="integrations" button onClick={() => this.handleMenuNavigation(RoutePaths.Integrations)}>
                    <ListItemIcon>
                        <ArrowDecision />
                    </ListItemIcon>
                    <ListItemText primary="Integrations" />
                </ListItem>

                <ListItem id="breadcrumbs" button>
                    <Badge
                        classes={{ badge: classes.badge }}
                        badgeContent={
                            <Typography className={classes.badgeTypography} variant="caption" align="center">
                                Coming soon
                            </Typography>
                        }
                        color="primary"
                    >
                        <ListItemIcon>
                            <MapMarkerPath />
                        </ListItemIcon>
                        <ListItemText primary="Breadcrumbs" />
                    </Badge>
                </ListItem>

                <ListItem
                    id="projects"
                    button
                    onClick={() => {
                        this.handleMenuNavigation(RoutePaths.Projects);
                    }}
                >
                    <ListItemIcon>
                        <HexagonMultiple />
                    </ListItemIcon>
                    <ListItemText primary="Projects" />
                </ListItem>
                {userIsInRole(this.props.user, RoleEnum.ADMIN) && (
                    <React.Fragment>
                        <ListItem id="administration" button onClick={() => this.handleMenuToggle('administration')}>
                            <ListItemIcon>
                                <Lock />
                            </ListItemIcon>
                            <ListItemText primary="Administration" />
                            <Fade in={this.props.expandedSection === 'administration'} timeout={timeout}>
                                <ExpandLess />
                            </Fade>
                        </ListItem>
                        <Collapse in={this.props.expandedSection === 'administration'} timeout={500} unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem button className={classes.nested} onClick={() => this.handleMenuNavigation(RoutePaths.Users)}>
                                    <ListItemIcon>
                                        <People />
                                    </ListItemIcon>
                                    <ListItemText primary="Users" />
                                </ListItem>
                                {userIsInRole(this.props.user, RoleEnum.OWNER) && (
                                    <React.Fragment>
                                        <ListItem button className={classes.nested} onClick={() => this.handleMenuNavigation(RoutePaths.Domain)}>
                                            <ListItemIcon>
                                                <Domain />
                                            </ListItemIcon>
                                            <ListItemText primary="Organization" />
                                        </ListItem>
                                        <ListItem button className={classes.nested} onClick={() => this.handleMenuNavigation(RoutePaths.Domain)}>
                                            <ListItemIcon>
                                                <CreditCard />
                                            </ListItemIcon>
                                            <ListItemText primary="Billing" />
                                        </ListItem>
                                    </React.Fragment>
                                )}
                            </List>
                        </Collapse>
                    </React.Fragment>
                )}

                <Hidden mdUp implementation="css">
                    <ListItem id="account" button onClick={() => this.handleMenuToggle('account')}>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                        <Fade in={this.props.expandedSection === 'account'} timeout={timeout}>
                            <ExpandLess />
                        </Fade>
                    </ListItem>
                    <Collapse in={this.props.expandedSection === 'account'} timeout={500} unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button className={classes.nested} onClick={() => this.handleMenuNavigation(RoutePaths.Account)}>
                                <ListItemIcon>
                                    <AccountCircle />
                                </ListItemIcon>
                                <ListItemText primary="Account" />
                            </ListItem>

                            <ListItem button className={classes.nested} onClick={() => this.props.push(RoutePaths.Logout)}>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </Collapse>
                </Hidden>
            </List>
        );

        return (
            <nav className={classes.drawer}>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={'top'}
                        open={this.props.mobileOpen}
                        onClose={this.props.handleDrawerToggle}
                        SlideProps={{
                            timeout: { enter: theme.drawer.enterDuration, exit: theme.drawer.leavingDuration },
                        }}
                    >
                        <Button classes={{ root: classes.logoButtonRoot }} disableRipple={true} onClick={() => this.props.push(RoutePaths.Landing)}>
                            <Typography variant="h5">Ranger</Typography>
                        </Button>
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
                        <div className={classes.headerPush} />
                        {drawerContent}
                    </Drawer>
                </Hidden>
            </nav>
        );
    }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Menu));
