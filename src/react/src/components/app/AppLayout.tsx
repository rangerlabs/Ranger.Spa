import { Route } from 'react-router';
import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import Header from './header/Header';
import Menu from './menu/Menu';
import { connect } from 'react-redux';
import { CssBaseline, Fade, Theme } from '@material-ui/core';
import Dialog from '../dialog/Dialog';
import { ApplicationState } from '../../stores';
import { User } from 'oidc-client';
import IProject from '../../models/app/IProject';
import BreadcrumbPath from '../../models/app/BreadcrumbPath';
import BreadcrumbPaths from '../BreadcrumbPaths';
import Breadcrumb from '../../models/app/Breadcrumb';
import authorizedRoute from './hocs/AuthorizedRouteHOC';
import { addDomain, DomainState } from '../../redux/actions/DomainActions';
import { getSubDomain } from '../../helpers/Helpers';
import Constants from '../../theme/Constants';
import { SubscriptionLimitDetailsState } from '../../redux/actions/SubscriptionLimitDetailsActions';
import { SnackbarNotification } from '../../redux/actions/SnackbarActions';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import SubscriptionInactiveFooter from './subscription/SubscriptionInactiveFooter';
import populateSubscriptionLimitDataHOC from './hocs/PopulateSubscriptionLimitDataHOC';
const hash = require('object-hash');

const styles = (theme: Theme) =>
    createStyles({
        toolbar: {
            height: Constants.HEIGHT.TOOLBAR,
        },
        root: {
            display: 'flex',
            height: '100%',
        },
        content: {
            flexGrow: 1,
        },
    });

interface AppLayoutProps extends WithStyles<typeof styles>, WithSnackbarProps {
    user: User;
    subscription: SubscriptionLimitDetailsState;
    component?: any;
    exact?: boolean;
    path?: string | string[];
    breadcrumbPath: BreadcrumbPath;
    selectedProject: IProject;
    domain: string;
    setDomain: (domainName: string) => void;
}

interface AppLayoutState {
    mobileOpen: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
        selectedProject: state.selectedProject,
        domain: state.domain.domain,
        subscription: state.subscriptionLimitDetailsState,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setDomain: (domainName: string) => {
            const action = addDomain({ domain: domainName } as DomainState);
            dispatch(action);
        },
    };
};

class AppLayout extends React.Component<AppLayoutProps, AppLayoutState> {
    state: AppLayoutState = {
        mobileOpen: false,
    };

    componentDidMount = () => {
        if (!this.props.domain) {
            this.props.setDomain(getSubDomain());
        }
    };

    handleDrawerToggle = () => {
        this.setState(() => ({ mobileOpen: !this.state.mobileOpen }));
    };

    completeBreadcrumbsWithProjectName = () => {
        const { breadcrumbPath } = this.props;
        let result = breadcrumbPath.breadcrumbs;
        if (breadcrumbPath.requiresLeadingProjectBreadcrumb) {
            if (this.props.selectedProject.name) {
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
                render={(props) => (
                    <div className={classes.root}>
                        <CssBaseline />
                        <Dialog />
                        <Header breadcrumbs={this.completeBreadcrumbsWithProjectName()} handleDrawerToggle={this.handleDrawerToggle} {...props} />
                        <Menu handleDrawerToggle={this.handleDrawerToggle} mobileOpen={this.state.mobileOpen} {...props} />
                        <Fade in timeout={550}>
                            <main className={classes.content}>
                                <div className={classes.toolbar} />
                                <Component {...props} />
                            </main>
                        </Fade>
                        <SubscriptionInactiveFooter />
                    </div>
                )}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(authorizedRoute(populateSubscriptionLimitDataHOC(withSnackbar(AppLayout)))));
