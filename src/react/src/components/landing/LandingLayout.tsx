import { Route } from "react-router";
import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core/styles";
import LandingHeader from "./header/LandingHeader";
import LandingMenu from "./menu/LandingMenu";
import { connect } from "react-redux";
import { CssBaseline, Fade } from "@material-ui/core";
import Dialog from "../dialog/Dialog";
import UserManager from "../../services/UserManager";
import { ApplicationState } from "../../stores";
import { User } from "oidc-client";
import RoutePaths from "../RoutePaths";

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
    showOpaqueHeader: boolean;
};

class LandingLayout extends React.Component<LandingLayoutProps, LandingLayoutState> {
    constructor(props: LandingLayoutProps) {
        super(props);
        if (window.location.pathname === RoutePaths.Landing) {
            this.state = { mobileOpen: false, showOpaqueHeader: false, slideIn: true };
        }
    }
    state = {
        mobileOpen: false,
        showOpaqueHeader: true,
        slideIn: false,
    };

    signOut = () => {
        const idTokenHint = this.props.user.id_token;
        UserManager.signoutRedirect({ id_token_hint: idTokenHint });
    };

    handleDrawerToggle = () => {
        this.setState(prevState => ({ mobileOpen: !prevState.mobileOpen }));
    };

    render() {
        const { classes, component: Component, user, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={props => (
                    <div className={classes.root}>
                        <CssBaseline />
                        <Dialog />
                        <LandingHeader user={user} signOut={this.signOut} handleDrawerToggle={this.handleDrawerToggle} {...props} />
                        <LandingMenu
                            user={user}
                            signOut={this.signOut}
                            handleDrawerToggle={this.handleDrawerToggle}
                            mobileOpen={this.state.mobileOpen}
                            {...props}
                        />
                        <Fade in timeout={750}>
                            <main className={classes.content}>
                                <Component {...props} />
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
