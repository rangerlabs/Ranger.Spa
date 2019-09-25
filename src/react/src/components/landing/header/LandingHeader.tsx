import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Hidden, Typography, Button, Link, Theme } from "@material-ui/core";
import { User } from "oidc-client";
import AccountPopOut from "../../accountPopOut/AccountPopOut";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import RoutePaths from "../../RoutePaths";
import { Parallax } from "react-spring/renderprops-addons";
const classNames = require("classnames").default;

const styles = (theme: Theme) =>
    createStyles({
        toolbarLeft: {
            flexGrow: 1,
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
        menuButton: {
            [theme.breakpoints.up("md")]: {
                display: "none",
            },
        },
        logoButtonRoot: {
            "&:hover": {
                background: "none",
            },
        },
    });

interface LandingHeaderProps extends WithStyles<typeof styles> {
    parallaxRef?: Parallax;
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
    handleCompanyClick = () => {
        this.props.push(RoutePaths.Company);
    };
    handleDocumentationClick = () => {
        this.props.push(RoutePaths.Documentation);
    };
    handlePricingClick = () => {
        this.props.push(RoutePaths.Pricing);
    };
    render() {
        const { classes } = this.props;
        return (
            <AppBar elevation={0} position="fixed" className={classes.appBarOpaque}>
                <Toolbar id="back-to-top-anchor">
                    <div className={classes.toolbarLeft}>
                        <Button classes={{ root: classes.logoButtonRoot }} disableRipple={true} onClick={this.handleLogoClick}>
                            <Typography align="center" variant="h5">
                                Ranger
                            </Typography>
                        </Button>
                    </div>
                    <Hidden smDown implementation="css">
                        <Link
                            component="button"
                            variant="subtitle1"
                            color="textPrimary"
                            className={classes.landingLink}
                            onClick={this.handleDocumentationClick}
                        >
                            Documentation
                        </Link>
                        <Link component="button" variant="subtitle1" color="textPrimary" className={classes.landingLink} onClick={this.handlePricingClick}>
                            Pricing
                        </Link>
                        <Link component="button" variant="subtitle1" color="textPrimary" className={classes.landingLink} onClick={this.handleCompanyClick}>
                            Company
                        </Link>
                        <div className={classes.actionContainer}>
                            {this.props.user && !this.props.user.expired ? (
                                <AccountPopOut />
                            ) : (
                                <div>
                                    <Button variant="outlined" color="primary" classes={{ root: classes.landingLink }} onClick={this.handleSignInClick}>
                                        Sign in
                                    </Button>
                                    <Button color="primary" variant="contained" onClick={this.handleSignUpClick} classes={{ root: classes.landingLink }}>
                                        Sign up
                                    </Button>
                                </div>
                            )}
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
