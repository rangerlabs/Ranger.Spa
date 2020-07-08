import { Route } from 'react-router';
import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import LandingHeader from './header/LandingHeader';
import LandingMenu from './menu/LandingMenu';
import { connect } from 'react-redux';
import { CssBaseline, Fade, Theme } from '@material-ui/core';
import Dialog from '../dialog/Dialog';
import { ApplicationState } from '../../stores';
import { User } from 'oidc-client';
import RoutePaths from '../RoutePaths';
import Notifier from '../../components/notifier/Notifier';
import { Parallax } from 'react-spring/renderprops-addons';
import Constants from '../../theme/Constants';
import Footer from './footer/Footer';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100%',
            backgroundColor: theme.palette.common.white,
        },
        content: {
            flexGrow: 1,
        },
        main: {
            height: '100%',
        },
        toolbar: {
            height: '64px',
        },
    });

interface LandingLayoutProps extends WithStyles<typeof styles> {
    user: User;
    component?: any;
    exact?: boolean;
    path?: string | string[];
}
type LandingLayoutState = {
    mobileOpen: boolean;
    safeToPassRef: boolean;
    atPageTop: boolean;
};

const mapStateToProps = (state: ApplicationState) => {
    return { user: state.oidc.user };
};

class LandingLayout extends React.Component<LandingLayoutProps, LandingLayoutState> {
    constructor(props: LandingLayoutProps) {
        super(props);
        if (window.location.pathname === RoutePaths.Landing) {
            this.state = { mobileOpen: false, safeToPassRef: false, atPageTop: false, slideIn: true };
        }
    }
    state = {
        mobileOpen: false,
        safeToPassRef: false,
        atPageTop: false,
        slideIn: false,
    };

    handleDrawerToggle = () => {
        this.setState((prevState) => ({ mobileOpen: !prevState.mobileOpen }));
    };

    componentDidMount() {
        this.setState({ safeToPassRef: true });
    }

    render() {
        const { classes, component: Component, user, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={(props) => (
                    <div className={classes.root}>
                        <CssBaseline />
                        <Dialog />
                        {this.state.safeToPassRef && <LandingHeader user={user} handleDrawerToggle={this.handleDrawerToggle} {...props} />}
                        <LandingMenu user={user} handleDrawerToggle={this.handleDrawerToggle} mobileOpen={this.state.mobileOpen} {...props} />
                        <Fade in timeout={550}>
                            <React.Fragment>
                                <main className={classes.content}>
                                    <div id="toolbar-push" className={classes.toolbar} />
                                    <Component {...props} />
                                </main>
                            </React.Fragment>
                        </Fade>
                    </div>
                )}
            />
        );
    }
}
export default connect(mapStateToProps)(withStyles(styles)(LandingLayout));
