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
import { populateProjects } from '../../redux/actions/ProjectActions';
import ProjectService from '../../services/ProjectService';
import IProject from '../../models/app/IProject';
import BreadcrumbPath from '../../models/app/BreadcrumbPath';
import BreadcrumbPaths from '../BreadcrumbPaths';
import Breadcrumb from '../../models/app/Breadcrumb';
import Notifier from '../../components/notifier/Notifier';
import authorizedRoute from './hocs/AuthorizedRouteHOC';

const userService = new UserService();
const projectService = new ProjectService();

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
    setProjects: (projects: IProject[]) => void;
    users: IUser[];
    selectedProject: IProject;
}

const mapStateToProps = (state: ApplicationState) => {
    return { users: state.users, projects: state.projects, user: state.oidc.user, selectedProject: state.selectedProject };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setUsers: (users: IUser[]) => {
            const action = populateUsers(users);
            dispatch(action);
        },
        setProjects: (projects: IProject[]) => {
            const action = populateProjects(projects);
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
            projectService.getProjects().then(projectResponse => {
                this.props.setProjects(projectResponse.content);
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

    completeBreadcrumbsWithProjectName = () => {
        const { breadcrumbPath } = this.props;
        let result = breadcrumbPath.breadcrumbs;
        if (breadcrumbPath.requiresLeadingProjectBreadcrumb) {
            if (this.props.selectedProject) {
                const appBreadcrumbIncluded = Object.assign<Breadcrumb[], Breadcrumb[]>([], breadcrumbPath.breadcrumbs);
                appBreadcrumbIncluded.unshift(BreadcrumbPaths.GetProjectBreadCrumb(this.props.selectedProject.name));
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
                        <Header breadcrumbs={this.completeBreadcrumbsWithProjectName()} handleDrawerToggle={this.handleDrawerToggle} {...props} />
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
