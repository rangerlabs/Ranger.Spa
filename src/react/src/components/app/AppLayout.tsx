import { Route } from 'react-router';
import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import Header from './header/Header';
import Menu from './menu/Menu';
import { connect } from 'react-redux';
import { CssBaseline, Fade, Theme } from '@material-ui/core';
import Dialog from '../dialog/Dialog';
import UserManager from '../../services/UserManager';
import { ApplicationState } from '../../stores';
import { User } from 'oidc-client';
import UserService from '../../services/UserService';
import IUser from '../../models/app/IUser';
import { populateUsers } from '../../redux/actions/UserActions';
import { populateApps } from '../../redux/actions/AppActions';
import AppService from '../../services/AppService';
import IApp from '../../models/app/IApp';
import GeoFenceService from '../../services/GeoFenceService';
import { populateGeoFences } from '../../redux/actions/GeoFenceActions';
import CircularGeoFence from '../../models/app/geofences/CircularGeoFence';
import PolygonGeoFence from '../../models/app/geofences/PolygonGeoFence';
import BreadcrumbPath from '../../models/app/BreadcrumbPath';
import BreadcrumbPaths from '../BreadcrumbPaths';
import Breadcrumb from '../../models/app/Breadcrumb';
import { populateIntegrations } from '../../redux/actions/IntegrationActions';
import { MergedIntegrationType } from '../../models/app/integrations/MergedIntegrationType';
import IntegrationService from '../../services/IntegrationService';
import Notifier from '../../components/notifier/Notifier';
import authorizedRoute from './hocs/AuthorizedRouteHOC';

const userService = new UserService();
const appService = new AppService();
const geoFenceService = new GeoFenceService();
const integrationService = new IntegrationService();

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100%',
        },
        content: {
            flexGrow: 1,
        },
        toolbar: theme.mixins.toolbar,
    });

interface AppLayoutProps extends WithStyles<typeof styles> {
    user: User;
    component?: any;
    exact?: boolean;
    path?: string | string[];
    breadcrumbPath: BreadcrumbPath;
    setUsers: (users: IUser[]) => void;
    setApps: (apps: IApp[]) => void;
    setGeoFences: (geofences: Array<CircularGeoFence | PolygonGeoFence>) => void;
    setIntegrations: (geofences: Array<MergedIntegrationType>) => void;
    users: IUser[];
    selectedApp: IApp;
}

const mapStateToProps = (state: ApplicationState) => {
    return { users: state.users, apps: state.apps, user: state.oidc.user, selectedApp: state.selectedApp };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setUsers: (users: IUser[]) => {
            const action = populateUsers(users);
            dispatch(action);
        },
        setApps: (apps: IApp[]) => {
            const action = populateApps(apps);
            dispatch(action);
        },
        setGeoFences: (geofences: Array<CircularGeoFence | PolygonGeoFence>) => {
            const action = populateGeoFences(geofences);
            dispatch(action);
        },
        setIntegrations: (integrations: Array<MergedIntegrationType>) => {
            const action = populateIntegrations(integrations);
            dispatch(action);
        },
    };
};

class AppLayout extends React.Component<AppLayoutProps> {
    state = {
        mobileOpen: false,
    };

    //hydrate the store when the first AppLayout path is to be rendered
    componentDidMount = () => {
        if (this.props.users.length == 0) {
            userService.getUsers().then(userResponse => {
                this.props.setUsers(userResponse.content);
            });
            appService.getApps().then(appResponse => {
                this.props.setApps(appResponse.content);
            });
            geoFenceService.getGeoFences().then(geoFenceResponse => {
                this.props.setGeoFences(geoFenceResponse);
            });
            integrationService.getIntegrations().then(integrationResponse => {
                this.props.setIntegrations(integrationResponse);
            });
        }
    };

    signOut = () => {
        const idTokenHint = this.props.user.id_token;
        UserManager.signoutRedirect({ id_token_hint: idTokenHint });
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !this.state.mobileOpen }));
    };

    completeBreadcrumbsWithAppName = () => {
        const { breadcrumbPath } = this.props;
        let result = breadcrumbPath.breadcrumbs;
        if (breadcrumbPath.requiresLeadingAppBreadcrumb) {
            if (this.props.selectedApp) {
                const appBreadcrumbIncluded = Object.assign<Breadcrumb[], Breadcrumb[]>([], breadcrumbPath.breadcrumbs);
                appBreadcrumbIncluded.unshift(BreadcrumbPaths.GetAppBreadCrumb(this.props.selectedApp.name));
                result = appBreadcrumbIncluded;
            }
        }
        return result;
    };

    render() {
        const { component: Component, classes, breadcrumbPath, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={props => (
                    <div className={classes.root}>
                        <CssBaseline />
                        <Dialog />
                        <Notifier />
                        <Header breadcrumbs={this.completeBreadcrumbsWithAppName()} handleDrawerToggle={this.handleDrawerToggle} {...props} />
                        <Menu signOut={this.signOut} handleDrawerToggle={this.handleDrawerToggle} mobileOpen={this.state.mobileOpen} {...props} />
                        <Fade in timeout={750}>
                            <main className={classes.content}>
                                <div className={classes.toolbar} />
                                <Component {...props} />
                            </main>
                        </Fade>
                    </div>
                )}
            />
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(authorizedRoute(AppLayout)));
