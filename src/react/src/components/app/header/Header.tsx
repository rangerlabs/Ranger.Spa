import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountPopOut from "../../accountPopOut/AccountPopOut";
import { Hidden, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { ApplicationState } from "../../../stores";
import { User } from "oidc-client";
import CustomizedBreadcrumbs from "./Breadcrumbs";
import Breadcrumb from "../../../models/app/Breadcrumb";

const styles = (theme: Theme) =>
    createStyles({
        toolbarLeft: {
            flexGrow: 1,
        },
        appBar: {
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${theme.drawer.width}px)`,
            },
            backgroundColor: "#FFFFFF",
            boxShadow: "none",
        },
        menuButton: {
            [theme.breakpoints.up("md")]: {
                display: "none",
            },
        },
        headerPrimaryColor: {
            color: "#6642a3",
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
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <div className={classes.toolbarLeft}>
                        <CustomizedBreadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                    <Typography variant="subtitle1" className={classes.headerPrimaryColor}>
                        Hi, {this.props.user.profile.firstName}
                    </Typography>
                    <Hidden smDown implementation="css">
                        <AccountPopOut />
                    </Hidden>
                    <IconButton className={classes.menuButton} aria-label="Menu" onClick={this.props.handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Header));
