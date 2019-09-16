import * as React from "react";
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
    Button,
    Fade,
    Grid,
} from "@material-ui/core";
import Home from "@material-ui/icons/Home";
import GpsFixed from "@material-ui/icons/GpsFixed";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ArrowForward from "@material-ui/icons/ArrowForward";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Lock from "@material-ui/icons/Lock";
import Equalizer from "@material-ui/icons/Equalizer";
import { User } from "oidc-client";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import Logo from "../../../theme/Logo";
import RoutePaths from "../../RoutePaths";
const classNames = require("classnames").default;

const styles = (theme: Theme) =>
    createStyles({
        drawerPaper: {
            width: theme.drawer.width,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        logo: {
            ...theme.mixins.toolbar,
            "&:hover": { background: "none" },
        },
        divider: {
            position: "relative",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            margin: "auto",
            width: "90%",
        },
        listItemHover: {
            height: theme.toolbar.height,
            "&:hover": {
                backgroundColor: theme.palette.primary.main,
            },
        },
        menuButton: {
            margin: "auto",
            width: "70%",
        },
    });
interface LandingMenuProps extends WithStyles<typeof styles> {
    user: User;
    theme: Theme;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    push: typeof push;
}

type LandingMenuState = {
    accountListItemExpanded: boolean;
};

class LandingMenu extends React.Component<LandingMenuProps, LandingMenuState> {
    state: LandingMenuState = {
        accountListItemExpanded: false,
    };

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

    toggleExpanded = () => {
        this.setState(prevState => ({
            accountListItemExpanded: !prevState.accountListItemExpanded,
        }));
    };

    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <div>
                <Grid container direction="column" justify="center" alignItems="center" className={classes.logo}>
                    <Grid item>
                        <Button href="/">
                            <Logo />
                            <Typography align="center" variant="h5">
                                Ranger
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <List>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#overview">
                        <ListItemIcon>
                            <Home htmlColor={theme.palette.primary.main} />
                        </ListItemIcon>
                        <ListItemText primary="Overview" />
                    </ListItem>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#howitworks">
                        <ListItemIcon>
                            <GpsFixed htmlColor={theme.palette.primary.main} />
                        </ListItemIcon>
                        <ListItemText primary="How it works" />
                    </ListItem>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#features">
                        <ListItemIcon>
                            <ArrowForward htmlColor={theme.palette.primary.main} />
                        </ListItemIcon>
                        <ListItemText primary="Features" />
                    </ListItem>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#pricing">
                        <ListItemIcon>
                            <Equalizer htmlColor={theme.palette.primary.main} />
                        </ListItemIcon>
                        <ListItemText primary="Pricing" />
                    </ListItem>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#contact">
                        <ListItemIcon>
                            <Equalizer htmlColor={theme.palette.primary.main} />
                        </ListItemIcon>
                        <ListItemText primary="Contact" />
                    </ListItem>
                    {this.props.user && !this.props.user.expired ? (
                        <ListItem classes={{ button: classes.listItemHover }} button onClick={this.toggleExpanded}>
                            <ListItemIcon>
                                <AccountCircle htmlColor={theme.palette.primary.main} />
                            </ListItemIcon>
                            <ListItemText primary="Account" />
                            {this.state.accountListItemExpanded ? (
                                <ExpandLess htmlColor={theme.palette.primary.main} />
                            ) : (
                                <ExpandMore htmlColor={theme.palette.primary.main} />
                            )}
                        </ListItem>
                    ) : (
                        <ListItem classes={{ button: classes.listItemHover }} button onClick={this.handleSignInClick}>
                            <ListItemIcon>
                                <AccountCircle htmlColor={theme.palette.primary.main} />
                            </ListItemIcon>
                            <ListItemText primary="Sign in" />
                        </ListItem>
                    )}
                    <Collapse in={this.state.accountListItemExpanded} timeout={500} unmountOnExit>
                        <List disablePadding>
                            <ListItem
                                button
                                className={classNames(classes.listItemHover, classes.nested)}
                                onClick={() => {
                                    this.props.push(RoutePaths.Logout);
                                }}
                            >
                                <ListItemIcon>
                                    <Lock htmlColor={theme.palette.primary.main} />
                                </ListItemIcon>
                                <ListItemText inset primary="Logout" />
                                <Fade in={this.state.accountListItemExpanded} timeout={500}>
                                    <ExpandLess htmlColor={theme.palette.primary.main} />
                                </Fade>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </div>
        );

        return (
            <Hidden mdUp implementation="css">
                <nav>
                    <Drawer
                        variant="temporary"
                        anchor={"right"}
                        open={this.props.mobileOpen}
                        onClose={this.props.handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        SlideProps={{
                            timeout: { enter: theme.drawer.enterDuration, exit: theme.drawer.leavingDuration },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                </nav>
            </Hidden>
        );
    }
}

export default withStyles(styles, { withTheme: true })(
    connect(
        null,
        { push }
    )(LandingMenu)
);
