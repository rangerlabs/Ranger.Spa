import * as React from 'react';
import { withStyles, createStyles, WithStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountPopOut from '../../accountPopOut/AccountPopOut';
import { Hidden, Typography, Grid, Theme, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { User } from 'oidc-client';
import CustomizedBreadcrumbs from './Breadcrumbs';
import Breadcrumb from '../../../models/app/Breadcrumb';
import RoutePaths from '../../RoutePaths';
import { push } from 'connected-react-router';

const styles = (theme: Theme) =>
    createStyles({
        toolbarLeft: {
            flexGrow: 1,
        },
        logoContainer: {
            [theme.breakpoints.up('md')]: {
                width: theme.drawer.width as number,
            },
        },
        appBar: {
            [theme.breakpoints.up('md')]: {
                width: '100%',
                zIndex: theme.zIndex.drawer + 1,
            },
        },
        menuButton: {
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
            color: theme.palette.common.white,
        },
        logoButtonRoot: {
            '&:hover': {
                background: 'none',
            },
            color: theme.palette.common.white,
        },
        toolbarPadding: {
            [theme.breakpoints.up('md')]: {
                paddingLeft: 0,
            },
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return { user: state.oidc.user };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
    };
};

interface HeaderProps extends WithStyles<typeof styles> {
    breadcrumbs: Breadcrumb[];
    handleDrawerToggle: () => void;
    user: User;
    push: typeof push;
}

class Header extends React.Component<HeaderProps> {
    render() {
        const { classes, breadcrumbs } = this.props;
        return (
            <AppBar elevation={2} position="fixed" className={classes.appBar}>
                <Toolbar variant="dense" className={classes.toolbarPadding}>
                    <Button
                        className={classes.logoContainer}
                        classes={{ root: classes.logoButtonRoot }}
                        disableRipple={true}
                        onClick={() => this.props.push(RoutePaths.Landing)}
                    >
                        <Typography align="center" variant="h5">
                            Ranger
                        </Typography>
                    </Button>
                    <div className={classes.toolbarLeft}>
                        <Hidden smDown implementation="css">
                            <CustomizedBreadcrumbs breadcrumbs={breadcrumbs} />
                        </Hidden>
                    </div>
                    <Hidden smDown implementation="css">
                        <AccountPopOut />
                    </Hidden>
                    {this.props.user && <Typography variant="subtitle1">{this.props.user.profile.firstName}</Typography>}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header));
