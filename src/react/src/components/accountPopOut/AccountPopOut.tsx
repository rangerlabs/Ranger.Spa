import * as React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { createStyles, Theme, WithStyles, withStyles, Grow, Fade, Popper } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import RoutePaths from "../RoutePaths";
import { connect } from "react-redux";
import { push } from "connected-react-router";

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            marginRight: theme.spacing.unit * 2,
        },
    });

interface AccountPopOutProps extends WithStyles<typeof styles> {
    push: (path: string) => void;
}

type AccountPopOutState = {
    open: boolean;
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
    };
};

class AccountPopOut extends React.Component<AccountPopOutProps, AccountPopOutState> {
    anchorEl: React.RefObject<null>;
    constructor(props: AccountPopOutProps) {
        super(props);
        this.anchorEl = React.createRef();
    }

    state: AccountPopOutState = {
        open: false,
    };

    handleToggle = () => {
        this.setState(prevState => ({ open: !prevState.open }));
    };

    handleClose = (event: any) => {
        if ((this.anchorEl.current as any).contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };

    render() {
        return (
            <div>
                <Button buttonRef={this.anchorEl} aria-owns={open ? "menu-list-grow" : undefined} aria-haspopup="true" onClick={this.handleToggle}>
                    <AccountCircle />
                </Button>
                <Popper open={this.state.open} anchorEl={this.anchorEl.current} transition disablePortal>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper elevation={1}>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        {RoutePaths.IsCurrentLocationWhiteListed() && (
                                            <MenuItem
                                                onClick={e => {
                                                    this.props.push(RoutePaths.Home);
                                                    this.handleClose(e);
                                                }}
                                            >
                                                Home
                                            </MenuItem>
                                        )}
                                        <MenuItem
                                            onClick={e => {
                                                this.props.push(RoutePaths.Account);
                                                this.handleClose(e);
                                            }}
                                        >
                                            Account
                                        </MenuItem>
                                        <MenuItem
                                            onClick={e => {
                                                // this.props.signOut();
                                                this.props.push(RoutePaths.Logout);
                                                this.handleClose(e);
                                            }}
                                        >
                                            Logout
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </div>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(withStyles(styles)(AccountPopOut));
