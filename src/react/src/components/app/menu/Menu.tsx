import * as React from 'react';
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
    Button,
} from '@material-ui/core';
import People from '@material-ui/icons/People';
import MapMarker from 'mdi-material-ui/MapMarker';
import ViewDashboardOutline from 'mdi-material-ui/ViewDashboardOutline';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Lock from '@material-ui/icons/Lock';
import SpeakerPhone from '@material-ui/icons/SpeakerPhone';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import Web from 'mdi-material-ui/Web';
import ArrowDecision from 'mdi-material-ui/ArrowDecision';
import MapPlus from 'mdi-material-ui/MapPlus';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { ApplicationState } from '../../../stores';
import { expandSection } from '../../../redux/actions/MenuActions';
import { UserProfile } from '../../../models/UserProfile';
import { RoleEnum } from '../../../models/RoleEnum';
import RoutePaths from '../../../components/RoutePaths';
import { User } from 'oidc-client';
import IProject from '../../../models/app/IProject';
const classNames = require('classnames').default;

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
        divider: {
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            margin: 'auto',
            width: '90%',
        },
        listItemHover: {
            height: theme.toolbar.height,
            '&:hover ': {
                backgroundColor: '#7e57c2d1',
                '& $listItemTextColor': {
                    color: theme.palette.common.white,
                },
                '& $listItemIconColor': {
                    color: theme.palette.common.white,
                },
            },
        },
        listItemTextColor: {
            color: theme.palette.text.primary,
        },
        listItemIconColor: {
            color: theme.palette.primary.main,
        },
        menuButton: {
            margin: 'auto',
            width: '70%',
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        logoButtonRoot: {
            '&:hover': {
                background: 'none',
            },
        },
    });
interface MenuProps extends WithStyles<typeof styles> {
    theme: Theme;
    user: User;
    selectedProject: IProject;
    mobileOpen: boolean;
    signOut: () => void;
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
        if (this.props.selectedProject) {
            pushPath = path.replace(':appName', this.props.selectedProject.name);
        }
        this.props.push(pushPath);
    };

    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <List>
                <ListItem id="home" classes={{ button: classes.listItemHover }} button onClick={() => this.handleMenuNavigation(RoutePaths.Dashboard)}>
                    <ListItemIcon className={classes.listItemIconColor}>
                        <ViewDashboardOutline />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" className={classes.listItemTextColor} />
                </ListItem>

                <ListItem id="geofences" classes={{ button: classes.listItemHover }} button onClick={() => this.handleMenuToggle('geofences')}>
                    <ListItemIcon className={classes.listItemIconColor}>
                        <MapMarker />
                    </ListItemIcon>
                    <ListItemText primary="Geofences" className={classes.listItemTextColor} />
                    <Fade in={this.props.expandedSection === 'geofences'} timeout={timeout}>
                        <ExpandLess className={classes.listItemIconColor} />
                    </Fade>
                </ListItem>
                <Collapse in={this.props.expandedSection === 'geofences'} timeout={500} unmountOnExit>
                    <List disablePadding>
                        <ListItem
                            button
                            className={classNames(classes.listItemHover, classes.nested)}
                            onClick={() => this.handleMenuNavigation(RoutePaths.GeofenceMap)}
                        >
                            <ListItemIcon className={classes.listItemIconColor}>
                                <MapPlus />
                            </ListItemIcon>
                            <ListItemText primary="Map" className={classes.listItemTextColor} />
                        </ListItem>
                        <ListItem
                            button
                            className={classNames(classes.listItemHover, classes.nested)}
                            onClick={() => this.handleMenuNavigation(RoutePaths.GeofenceTable)}
                        >
                            <ListItemIcon className={classes.listItemIconColor}>
                                <FormatListBulleted />
                            </ListItemIcon>
                            <ListItemText primary="Table" classes={{ primary: classes.listItemTextColor }} />
                        </ListItem>
                        {/* <ListItem
                                button
                                className={classNames(classes.listItemHover, classes.nested)}
                                onClick={() => this.handleMenuNavigation("/geofences/import")}
                            >
                                <ListItemIcon>
                                    <FileImport  />
                                </ListItemIcon>
                                <ListItemText inset primary="Import" classes={{ primary: classes.menuItemTextColor }} />
                            </ListItem> */}
                    </List>
                </Collapse>

                <ListItem id="integrations" className={classes.listItemHover} button onClick={() => this.handleMenuNavigation(RoutePaths.Integrations)}>
                    <ListItemIcon className={classes.listItemIconColor}>
                        <ArrowDecision />
                    </ListItemIcon>
                    <ListItemText primary="Integrations" className={classes.listItemTextColor} />
                </ListItem>

                <ListItem
                    id="projects"
                    className={classes.listItemHover}
                    button
                    onClick={() => {
                        this.handleMenuNavigation(RoutePaths.Projects);
                    }}
                >
                    <ListItemIcon className={classes.listItemIconColor}>
                        <SpeakerPhone />
                    </ListItemIcon>
                    <ListItemText primary="Projects" className={classes.listItemTextColor} />
                </ListItem>
                {(this.props.user && (this.props.user.profile as UserProfile)).role.find(r => r.toUpperCase() === RoleEnum.ADMIN) && (
                    <React.Fragment>
                        <ListItem id="administration" className={classes.listItemHover} button onClick={() => this.handleMenuToggle('administration')}>
                            <ListItemIcon className={classes.listItemIconColor}>
                                <Lock />
                            </ListItemIcon>
                            <ListItemText primary="Administration" className={classes.listItemTextColor} />
                            <Fade in={this.props.expandedSection === 'administration'} timeout={timeout}>
                                <ExpandLess className={classes.listItemIconColor} />
                            </Fade>
                        </ListItem>
                        <Collapse in={this.props.expandedSection === 'administration'} timeout={500} unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem
                                    button
                                    className={classNames(classes.listItemHover, classes.nested)}
                                    onClick={() => this.handleMenuNavigation(RoutePaths.Users)}
                                >
                                    <ListItemIcon className={classes.listItemIconColor}>
                                        <People />
                                    </ListItemIcon>
                                    <ListItemText primary="Users" className={classes.listItemTextColor} />
                                </ListItem>

                                {(this.props.user && (this.props.user.profile as UserProfile)).role.find(r => r.toUpperCase() === RoleEnum.OWNER) && (
                                    <ListItem
                                        button
                                        className={classNames(classes.listItemHover, classes.nested)}
                                        onClick={() => this.handleMenuNavigation('/domain')}
                                    >
                                        <ListItemIcon className={classes.listItemIconColor}>
                                            <Web />
                                        </ListItemIcon>
                                        <ListItemText primary="Domain" className={classes.listItemTextColor} />
                                    </ListItem>
                                )}
                            </List>
                        </Collapse>
                    </React.Fragment>
                )}

                <Hidden mdUp implementation="css">
                    <ListItem id="account" className={classes.listItemHover} button onClick={() => this.handleMenuToggle('account')}>
                        <ListItemIcon className={classes.listItemIconColor}>
                            <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary="Account" className={classes.listItemTextColor} />
                        <Fade in={this.props.expandedSection === 'account'} timeout={timeout}>
                            <ExpandLess className={classes.listItemIconColor} />
                        </Fade>
                    </ListItem>
                    <Collapse in={this.props.expandedSection === 'account'} timeout={500} unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button className={classNames(classes.listItemHover, classes.nested)} onClick={this.props.signOut}>
                                <ListItemIcon className={classes.listItemIconColor}>
                                    <Lock />
                                </ListItemIcon>
                                <ListItemText primary="Logout" className={classes.listItemTextColor} />
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

export default withStyles(styles, { withTheme: true })(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Menu)
);
