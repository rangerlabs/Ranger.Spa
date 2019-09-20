import { Route } from "react-router";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import LandingHeader from "./header/LandingHeader";
import LandingMenu from "./menu/LandingMenu";
import { connect } from "react-redux";
import { CssBaseline, Fade, Theme } from "@material-ui/core";
import Dialog from "../dialog/Dialog";
import { ApplicationState } from "../../stores";
import { User } from "oidc-client";
import RoutePaths from "../RoutePaths";
import Notifier from "../../components/notifier/Notifier";
import { Parallax } from "react-spring/renderprops-addons";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            height: "100%",
        },
        content: {
            flexGrow: 1,
        },
        toolbar: theme.mixins.toolbar,
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

class LandingLayout extends React.Component<LandingLayoutProps, LandingLayoutState> {
    parallaxRef: Parallax;
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
        this.setState(prevState => ({ mobileOpen: !prevState.mobileOpen }));
    };

    componentDidMount() {
        this.setState({ safeToPassRef: true });
    }

    render() {
        const { classes, component: Component, user, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={props => (
                    <div className={classes.root}>
                        <CssBaseline />
                        <Dialog />
                        <Notifier />
                        {this.state.safeToPassRef && (
                            <LandingHeader parallaxRef={this.parallaxRef} user={user} handleDrawerToggle={this.handleDrawerToggle} {...props} />
                        )}
                        <LandingMenu user={user} handleDrawerToggle={this.handleDrawerToggle} mobileOpen={this.state.mobileOpen} {...props} />
                        <Fade in timeout={750}>
                            <main className={classes.content}>
                                <Component
                                    parallaxRef={(ref: Parallax) => {
                                        this.parallaxRef = ref;
                                    }}
                                    {...props}
                                />
                            </main>
                        </Fade>
                    </div>
                )}
            />
        );
    }
}

const mapStateToProps = (state: ApplicationState) => {
    return { user: state.oidc.user };
};
export default connect(mapStateToProps)(withStyles(styles)(LandingLayout));
