import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Hidden, Button, Link, Theme } from '@material-ui/core';
import { User } from 'oidc-client';
import AccountPopOut from '../../accountPopOut/AccountPopOut';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import RoutePaths from '../../RoutePaths';
import NameLogo from '../../../theme/NameLogo';

const styles = (theme: Theme) =>
    createStyles({
        toolbarLeft: {
            flexGrow: 1,
        },
        appBar: {
            background: 'white',
            zIndex: theme.zIndex.drawer + 1,
        },
        landingLink: {
            minWidth: '0px',
            marginLeft: '17px',
            marginRight: '17px',
        },
        actionContainer: {
            display: 'inline-flex',
        },
        menuButton: {
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        logoButtonRoot: {
            '&:hover': {
                background: 'none',
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

    handleSignUpClick = () => {
        this.props.push(RoutePaths.SignUp);
    };

    handleLogoClick = () => {
        this.props.push(RoutePaths.Landing);
    };
    handleContactClick = () => {
        this.props.push(RoutePaths.Contact);
    };
    handleAboutClick = () => {
        this.props.push(RoutePaths.About);
    };
    handleDocumentationClick = () => {
        this.props.push(RoutePaths.Docs.replace('/:name?', ''));
    };
    handlePricingClick = () => {
        this.props.push(RoutePaths.Pricing);
    };
    render() {
        const { classes } = this.props;
        return (
            <AppBar elevation={2} position="fixed" className={classes.appBar}>
                <Toolbar id="back-to-top-anchor">
                    <div className={classes.toolbarLeft}>
                        <Button classes={{ root: classes.logoButtonRoot }} disableRipple={true} onClick={this.handleLogoClick}>
                            <NameLogo width={'70px'} />
                        </Button>
                    </div>
                    <Hidden smDown implementation="css">
                        <Button size="small" variant="text" className={classes.landingLink} onClick={this.handleDocumentationClick}>
                            Docs
                        </Button>
                        <Button size="small" variant="text" className={classes.landingLink} onClick={this.handlePricingClick}>
                            Pricing
                        </Button>
                        <Button size="small" variant="text" className={classes.landingLink} onClick={this.handleContactClick}>
                            Contact
                        </Button>
                        <Button size="small" variant="text" className={classes.landingLink} onClick={this.handleAboutClick}>
                            About
                        </Button>
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

export default withStyles(styles)(connect(null, { push })(LandingHeader));
