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
    SvgIcon,
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
            // background: styledBy('color', {
            //     default: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            //     blue: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            //   }),
            // backgroundImage: "linear-gradient(-135deg, #b230ae 0%, #E94057 30%, #F27121 80%)",
            // backgroundImage: "linear-gradient(45deg, #ff7847 1%,#cc39cc 51%,#7e57c2 100%)",
            backgroundImage: "linear-gradient(45deg, rgba(204,153,204,1) 0%,rgba(126,87,194,1) 100%)",
            backgroundSize: "cover",
            // backgroundPosition: "center center",
            // "&::before": {
            //     width: "100%",
            //     height: "100%",
            //     content: "''",
            //     display: "block",
            //     opacity: 0.1,
            //     position: "absolute",
            //     background: "#000000",
            // },
        },
        nested: {
            paddingLeft: theme.spacing.unit * 4,
        },
        logo: {
            ...theme.mixins.toolbar,
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
        menuItemTextColor: {
            color: theme.drawer.text.color,
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
                            <Typography className={classes.menuItemTextColor} align="center" variant="h5">
                                Ranger
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <List>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#overview">
                        <ListItemIcon>
                            <Home nativeColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="Overview" classes={{ primary: classes.menuItemTextColor }} />
                    </ListItem>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#howitworks">
                        <ListItemIcon>
                            <GpsFixed nativeColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="How it works" classes={{ primary: classes.menuItemTextColor }} />
                    </ListItem>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#features">
                        <ListItemIcon>
                            <ArrowForward nativeColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="Features" classes={{ primary: classes.menuItemTextColor }} />
                    </ListItem>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#pricing">
                        <ListItemIcon>
                            <Equalizer nativeColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="Pricing" classes={{ primary: classes.menuItemTextColor }} />
                    </ListItem>
                    <ListItem classes={{ button: classes.listItemHover }} button href="#contact">
                        <ListItemIcon>
                            <Equalizer nativeColor={theme.drawer.text.color} />
                        </ListItemIcon>
                        <ListItemText primary="Contact" classes={{ primary: classes.menuItemTextColor }} />
                    </ListItem>
                    {this.props.user && !this.props.user.expired ? (
                        <ListItem classes={{ button: classes.listItemHover }} button onClick={this.toggleExpanded}>
                            <ListItemIcon>
                                <AccountCircle nativeColor={theme.drawer.text.color} />
                            </ListItemIcon>
                            <ListItemText classes={{ primary: classes.menuItemTextColor }} primary="Account" />
                            {this.state.accountListItemExpanded ? (
                                <ExpandLess nativeColor={theme.drawer.text.color} />
                            ) : (
                                <ExpandMore nativeColor={theme.drawer.text.color} />
                            )}
                        </ListItem>
                    ) : (
                        <ListItem classes={{ button: classes.listItemHover }} button onClick={this.handleSignInClick}>
                            <ListItemIcon>
                                <AccountCircle nativeColor={theme.drawer.text.color} />
                            </ListItemIcon>
                            <ListItemText primary="Sign in" classes={{ primary: classes.menuItemTextColor }} />
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
                                    <Lock nativeColor={theme.drawer.text.color} />
                                </ListItemIcon>
                                <ListItemText inset primary="Logout" classes={{ primary: classes.menuItemTextColor }} />
                                <Fade in={this.state.accountListItemExpanded} timeout={500}>
                                    <ExpandLess nativeColor={theme.drawer.text.color} />
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
