import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountPopOut from "../../accountPopOut/AccountPopOut";
import { Hidden, Typography, Grid, Theme } from "@material-ui/core";
import { connect } from "react-redux";
import { ApplicationState } from "../../../stores";
import { User } from "oidc-client";
import CustomizedBreadcrumbs from "./Breadcrumbs";
import Breadcrumb from "../../../models/app/Breadcrumb";
import Logo from "../../../theme/Logo";

const styles = (theme: Theme) =>
    createStyles({
        toolbarLeft: {
            flexGrow: 1,
        },
        logoContainer: {
            width: (theme.drawer.width as number) - theme.spacing(2),
        },
        appBar: {
            [theme.breakpoints.up("md")]: {
                width: "100%",
                zIndex: theme.zIndex.drawer + 1,
            },
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
        menuButton: {
            [theme.breakpoints.up("md")]: {
                display: "none",
            },
        },
        headerPrimaryColor: {
            color: theme.drawer.text.color,
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return { user: state.oidc.user };
};

interface HeaderProps extends WithStyles<typeof styles> {
    breadcrumbs: Breadcrumb[];
    handleDrawerToggle: () => void;
    user: User;
}

class Header extends React.Component<HeaderProps> {
    render() {
        const { classes, breadcrumbs } = this.props;
        return (
            <AppBar elevation={0} position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Grid container direction="row" className={classes.logoContainer}>
                        <Grid item>
                            <Logo />
                        </Grid>
                        <Grid item>
                            <Typography className={classes.headerPrimaryColor} align="center" variant="h5">
                                Ranger
                            </Typography>
                        </Grid>
                    </Grid>
                    <div className={classes.toolbarLeft}>
                        <CustomizedBreadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                    <Typography variant="subtitle1" className={classes.headerPrimaryColor}>
                        Hi, {this.props.user.profile.firstName}
                    </Typography>
                    <Hidden smDown implementation="css">
                        <AccountPopOut />
                    </Hidden>
                    <Hidden mdUp implementation="css">
                        <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.props.handleDrawerToggle}>
                            <MenuIcon />
                        </IconButton>
                    </Hidden>
                </Toolbar>
            </AppBar>
        );
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Header));
