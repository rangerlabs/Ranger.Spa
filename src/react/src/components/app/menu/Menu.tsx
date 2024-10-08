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
    Button,
    Box,
    Link,
} from '@material-ui/core';
import People from '@material-ui/icons/People';
import MapMarker from 'mdi-material-ui/MapMarker';
import ViewDashboard from 'mdi-material-ui/ViewDashboard';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Lock from '@material-ui/icons/Lock';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import Domain from 'mdi-material-ui/Domain';
import Heart from 'mdi-material-ui/Heart';
import RocketLaunch from 'mdi-material-ui/RocketLaunch';
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
import { userIsInRole, getSpaVersion } from '../../../helpers/Helpers';
import Logout from 'mdi-material-ui/Logout';
import CreditCard from 'mdi-material-ui/CreditCard';
import Cog from 'mdi-material-ui/Cog';
import Constants from '../../../theme/Constants';
import classNames from 'classnames';
import { red } from '@material-ui/core/colors';

const styles = (theme: Theme) =>
    createStyles({
        drawer: {
            [theme.breakpoints.up('md')]: {
                width: theme.drawer.width,
                flexShrink: 0,
            },
        },
        drawerPaper: {
            border: 'none',
            [theme.breakpoints.up('md')]: {
                zIndex: theme.zIndex.appBar - 1,
                width: theme.drawer.width,
            },
        },
        headerPush: {
            height: Constants.HEIGHT.TOOLBAR,
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
            right: '-35px',
        },
        badgeTypography: {
            lineHeight: 'inherit',
        },
        selected: {
            backgroundColor: Constants.COLORS.LIST_TABLE_HOVER_COLOR,
        },
        expandIcon: {
            transition: theme.transitions.create(['transform'], {
                duration: 500,
            }),
        },
        expanded: {
            transform: 'rotate(-180deg)',
        },
        closed: {
            transform: 'rotate(0)',
        },
        red: {
            color: red[500],
        },
        tinyIcon: {
            fontSize: '.75rem',
        },
    });
interface MenuProps extends WithStyles<typeof styles> {
    theme: Theme;
    user: User;
    selectedProject: IProject;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    push: typeof push;
    currentSelection: string;
    dispatchMenuSelection: (section: string) => void;
    canAccessUsersPage: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedProject: state.selectedProject,
        user: state.oidc.user,
        currentSelection: state.menu.currentSelection,
        canAccessUsersPage: state.subscriptionLimitDetailsState.subscriptionLimitDetails.limit.accounts > 1 || state.usersState.users.length > 1,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatchMenuSelection: (section: string) => {
            const action = expandSection({ currentSelection: section });
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class Menu extends React.Component<MenuProps> {
    handleMenuToggle = (name: string) => {
        const currentSelection = this.props.currentSelection === name ? '' : name;
        this.props.dispatchMenuSelection(currentSelection);
    };

    handleMenuNavigation = (path: string, currentSelection: string) => {
        let pushPath = path;
        this.handleMenuToggle(currentSelection);
        if (this.props.selectedProject.name) {
            pushPath = path.replace(':appName', this.props.selectedProject.name);
        }
        this.props.push(pushPath);
    };

    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <React.Fragment>
                <List>
                    <ListItem
                        className={this.props.currentSelection === 'dashboard' ? classes.selected : ''}
                        id="dashboard"
                        button
                        onClick={() => this.handleMenuNavigation(RoutePaths.Dashboard, 'dashboard')}
                    >
                        <ListItemIcon>
                            <ViewDashboard />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem
                        className={this.props.currentSelection === 'geofences' ? classes.selected : ''}
                        id="geofences"
                        button
                        onClick={() => this.handleMenuToggle('geofences')}
                    >
                        <ListItemIcon>
                            <MapMarker />
                        </ListItemIcon>
                        <ListItemText primary="Geofences" />
                        <ExpandLess
                            className={classNames(classes.expandIcon, this.props.currentSelection.startsWith('geofences') ? classes.expanded : classes.closed)}
                        />
                    </ListItem>
                    <Collapse in={this.props.currentSelection.startsWith('geofences')} timeout={500} unmountOnExit>
                        <List disablePadding>
                            <ListItem
                                className={classNames(classes.nested, this.props.currentSelection === 'geofences.map' ? classes.selected : '')}
                                button
                                onClick={() => this.handleMenuNavigation(RoutePaths.GeofenceMap, 'geofences.map')}
                            >
                                <ListItemIcon>
                                    <Map />
                                </ListItemIcon>
                                <ListItemText primary="Map" />
                            </ListItem>
                            <ListItem
                                className={classNames(classes.nested, this.props.currentSelection === 'geofences.table' ? classes.selected : '')}
                                button
                                onClick={() => this.handleMenuNavigation(RoutePaths.GeofenceTable, 'geofences.table')}
                            >
                                <ListItemIcon>
                                    <FormatListBulleted />
                                </ListItemIcon>
                                <ListItemText primary="Table" />
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem
                        className={this.props.currentSelection === 'integrations' ? classes.selected : ''}
                        id="integrations"
                        button
                        onClick={() => this.handleMenuNavigation(RoutePaths.Integrations, 'integrations')}
                    >
                        <ListItemIcon>
                            <ArrowDecision />
                        </ListItemIcon>
                        <ListItemText primary="Integrations" />
                    </ListItem>

                    {/* <ListItem className={this.props.currentSelection === 'breadcrumbs' ? classes.selected : ''} id="breadcrumbs" button>
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
                </ListItem> */}

                    <ListItem
                        className={this.props.currentSelection === 'projects' ? classes.selected : ''}
                        id="projects"
                        button
                        onClick={() => {
                            this.handleMenuNavigation(RoutePaths.Projects, 'projects');
                        }}
                    >
                        <ListItemIcon>
                            <HexagonMultiple />
                        </ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItem>
                    {userIsInRole(this.props.user, RoleEnum.ADMIN) && (
                        <React.Fragment>
                            <ListItem
                                className={this.props.currentSelection === 'administration' ? classes.selected : ''}
                                id="administration"
                                button
                                onClick={() => this.handleMenuToggle('administration')}
                            >
                                <ListItemIcon>
                                    <Lock />
                                </ListItemIcon>
                                <ListItemText primary="Administration" />
                                <ExpandLess
                                    className={classNames(
                                        classes.expandIcon,
                                        this.props.currentSelection.startsWith('administration') ? classes.expanded : classes.closed
                                    )}
                                />
                            </ListItem>
                            <Collapse in={this.props.currentSelection.startsWith('administration')} timeout={500} unmountOnExit>
                                <List component="div" disablePadding>
                                    {this.props.canAccessUsersPage && (
                                        <ListItem
                                            className={classNames(
                                                classes.nested,
                                                this.props.currentSelection === 'administration.users' ? classes.selected : ''
                                            )}
                                            button
                                            onClick={() => this.handleMenuNavigation(RoutePaths.Users, 'administration.users')}
                                        >
                                            <ListItemIcon>
                                                <People />
                                            </ListItemIcon>
                                            <ListItemText primary="Users" />
                                        </ListItem>
                                    )}
                                    {userIsInRole(this.props.user, RoleEnum.OWNER) && (
                                        <React.Fragment>
                                            <ListItem
                                                className={classNames(
                                                    classes.nested,
                                                    this.props.currentSelection === 'administration.organization' ? classes.selected : ''
                                                )}
                                                button
                                                onClick={() => this.handleMenuNavigation(RoutePaths.Organization, 'administration.organization')}
                                            >
                                                <ListItemIcon>
                                                    <Domain />
                                                </ListItemIcon>
                                                <ListItemText primary="Organization" />
                                            </ListItem>
                                            <ListItem
                                                className={classNames(
                                                    classes.nested,
                                                    this.props.currentSelection === 'administration.subscription' ? classes.selected : ''
                                                )}
                                                button
                                                onClick={() => this.handleMenuNavigation(RoutePaths.Subscription, 'administration.subscription')}
                                            >
                                                <ListItemIcon>
                                                    <CreditCard />
                                                </ListItemIcon>
                                                <ListItemText primary="Subscription" />
                                            </ListItem>
                                        </React.Fragment>
                                    )}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    )}

                    <Hidden mdUp implementation="css">
                        <ListItem id="settings" button onClick={() => this.handleMenuToggle('settings')}>
                            <ListItemIcon>
                                <Cog />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                            <ExpandLess
                                className={classNames(
                                    classes.expandIcon,
                                    this.props.currentSelection.startsWith('administration') ? classes.expanded : classes.closed
                                )}
                            />
                        </ListItem>
                        <Collapse in={this.props.currentSelection === 'settings'} timeout={500} unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem
                                    className={classNames(classes.nested, this.props.currentSelection === 'settings.account' ? classes.selected : '')}
                                    button
                                    onClick={() => this.handleMenuNavigation(RoutePaths.Account, 'settings.account')}
                                >
                                    <ListItemIcon>
                                        <AccountCircle />
                                    </ListItemIcon>
                                    <ListItemText primary="Account" />
                                </ListItem>

                                <ListItem
                                    className={classNames(classes.nested, this.props.currentSelection === 'settings.logout' ? classes.selected : '')}
                                    button
                                    onClick={() => this.props.push(RoutePaths.Logout, 'settings.logout')}
                                >
                                    <ListItemIcon>
                                        <Logout />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </List>
                        </Collapse>
                    </Hidden>
                </List>
                <Hidden mdDown>
                    <Box textAlign="center" position="absolute" height="32px" width="100%" bottom={'28px'} left="0px">
                        <div>
                            <Typography align="center" variant="caption">
                                v{getSpaVersion()}
                            </Typography>
                        </div>
                        <div>
                            <Typography align="center" variant="caption">
                                All Systems <Link href="https://rangerlabs.statuspage.io/">GO</Link> <RocketLaunch className={classes.tinyIcon} />
                            </Typography>
                        </div>
                        <div>
                            <Typography align="center" variant="caption">
                                Made with ️<Heart fontSize="small" className={classNames(classes.red, classes.tinyIcon)} /> in Cleveland
                            </Typography>
                        </div>
                    </Box>
                </Hidden>
            </React.Fragment>
        );

        return (
            <nav className={classes.drawer}>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
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
                        elevation={3}
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
