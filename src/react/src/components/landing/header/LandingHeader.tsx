import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Hidden, Typography, ButtonBase, Button, Slide } from "@material-ui/core";
import { User } from "oidc-client";
import AccountPopOut from "../../accountPopOut/AccountPopOut";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import Logo from "../../../theme/Logo";
import RoutePaths from "../../RoutePaths";
const classNames = require("classnames").default;

const styles = (theme: Theme) =>
    createStyles({
        toolbarLeft: {
            flexGrow: 1,
            marginLeft: "40px",
        },
        toolbarRight: {
            marginRight: "40px",
        },
        appBarOpaque: {
            background: "white",
        },
        landingLink: {
            marginLeft: "17px",
            marginRight: "17px",
        },
        actionContainer: {
            display: "inline-flex",
        },
        signupButton: {
            background: "linear-gradient(135deg,  #ac6cc6 50%, #8f70c2 100%)",
            color: "white",
        },
        menuButton: {
            [theme.breakpoints.up("md")]: {
                display: "none",
            },
        },
    });

interface LandingHeaderProps extends WithStyles<typeof styles> {
    user: User;
    handleDrawerToggle: () => void;
    push: typeof push;
}

class LandingHeader extends React.Component<LandingHeaderProps> {
    hasSubDomain = (): boolean => {
        const results = window.location.hostname.split(".");
        return results.length === 3;
    };

    handleSignInClick = () => {
        if (this.hasSubDomain()) {
            this.props.push(RoutePaths.Login);
        } else {
            this.props.push(RoutePaths.EnterDomain);
        }
    };

    handleSignUpClick = () => {
        this.props.push(RoutePaths.SignUp);
    };

    handleLogoClick = () => {
        this.props.push(RoutePaths.Landing);
    };

    render() {
        const { classes } = this.props;
        return (
            <AppBar elevation={0} position="fixed" className={classes.appBarOpaque}>
                <Toolbar>
                    <div className={classes.toolbarLeft}>
                        <Button onClick={this.handleLogoClick}>
                            <Logo />
                            <Typography variant="h6">Ranger</Typography>
                        </Button>
                    </div>
                    <Hidden smDown implementation="css">
                        <div className={classes.toolbarRight}>
                            <ButtonBase classes={{ root: classes.landingLink }}>
                                <Typography variant="subtitle1">Overview</Typography>
                            </ButtonBase>
                            <ButtonBase classes={{ root: classes.landingLink }}>
                                <Typography variant="subtitle1">Features</Typography>
                            </ButtonBase>
                            <ButtonBase classes={{ root: classes.landingLink }}>
                                <Typography variant="subtitle1">Pricing</Typography>
                            </ButtonBase>
                            <ButtonBase classes={{ root: classes.landingLink }}>
                                <Typography variant="subtitle1">Contact</Typography>
                            </ButtonBase>
                            <div className={classes.actionContainer}>
                                {this.props.user && !this.props.user.expired ? (
                                    <AccountPopOut />
                                ) : (
                                    <div>
                                        <Button variant="outlined" color="primary" classes={{ root: classes.landingLink }} onClick={this.handleSignInClick}>
                                            <Typography variant="subtitle1">Sign in</Typography>
                                        </Button>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={this.handleSignUpClick}
                                            classes={{ root: classNames(classes.landingLink, classes.signupButton) }}
                                        >
                                            <Typography variant="subtitle1">Sign up</Typography>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Hidden>
                    <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.props.handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(
    connect(
        null,
        { push }
    )(LandingHeader)
);
