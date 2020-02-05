import * as React from 'react';
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
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ViewDashboard from 'mdi-material-ui/ViewDashboardOutline';
import Lock from '@material-ui/icons/Lock';
import FileDocumentBoxOutline from 'mdi-material-ui/FileDocumentBoxOutline';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import Domain from 'mdi-material-ui/Domain';
import { User } from 'oidc-client';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
const classNames = require('classnames').default;

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
            '&:hover': { background: 'none' },
        },
        divider: {
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            margin: 'auto',
            width: '90%',
        },
        menuButton: {
            margin: 'auto',
            width: '70%',
        },
        logoButtonRoot: {
            '&:hover': {
                background: 'none',
            },
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
        const results = window.location.hostname.split('.');
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
                        <Button classes={{ root: classes.logoButtonRoot }} disableRipple onClick={() => this.props.push(RoutePaths.Landing)}>
                            <Typography align="center" variant="h5">
                                Ranger
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />

                <List>
                    {this.props.user && !this.props.user.expired && (
                        <ListItem button onClick={() => this.props.push(RoutePaths.Dashboard)}>
                            <ListItemIcon>
                                <ViewDashboard />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                    )}

                    <ListItem button onClick={() => this.props.push(RoutePaths.Documentation)}>
                        <ListItemIcon>
                            <FileDocumentBoxOutline />
                        </ListItemIcon>
                        <ListItemText primary="Documentation" />
                    </ListItem>
                    <ListItem button onClick={() => this.props.push(RoutePaths.Pricing)}>
                        <ListItemIcon>
                            <CurrencyUsd />
                        </ListItemIcon>
                        <ListItemText primary="Pricing" />
                    </ListItem>
                    <ListItem button onClick={() => this.props.push(RoutePaths.Company)}>
                        <ListItemIcon>
                            <Domain />
                        </ListItemIcon>
                        <ListItemText primary="Company" />
                    </ListItem>

                    {this.props.user && !this.props.user.expired ? (
                        <ListItem id="account" button onClick={this.toggleExpanded}>
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText primary="Account" />
                            <Fade in={this.state.accountListItemExpanded} timeout={500}>
                                <ExpandLess />
                            </Fade>
                        </ListItem>
                    ) : (
                        <ListItem button onClick={this.handleSignInClick}>
                            <ListItemIcon>
                                <AccountCircle htmlColor={theme.palette.primary.main} />
                            </ListItemIcon>
                            <ListItemText primary="Sign in" />
                        </ListItem>
                    )}
                    <Collapse in={this.state.accountListItemExpanded} timeout={500} unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem
                                button
                                className={classes.nested}
                                onClick={() => {
                                    this.props.push(RoutePaths.Account);
                                }}
                            >
                                <ListItemIcon>
                                    <Lock />
                                </ListItemIcon>
                                <ListItemText primary="Account" />
                            </ListItem>
                            <ListItem
                                button
                                className={classes.nested}
                                onClick={() => {
                                    this.props.push(RoutePaths.Logout);
                                }}
                            >
                                <ListItemIcon>
                                    <Lock />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
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
                        anchor={'top'}
                        open={this.props.mobileOpen}
                        onClose={this.props.handleDrawerToggle}
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

export default withStyles(styles, { withTheme: true })(connect(null, { push })(LandingMenu));
