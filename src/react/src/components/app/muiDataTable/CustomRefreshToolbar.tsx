import * as React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import { WithStyles, Theme, createStyles, withStyles, IconButton, Tooltip } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        icon: {
            '&:hover': {
                color: theme.palette.primary.main,
            },
        },
    });

interface CustomRefreshToolbarProps extends WithStyles<typeof styles> {
    onClick: () => void;
}

class CustomRefreshToolbar extends React.Component<CustomRefreshToolbarProps> {
    render() {
        const { classes } = this.props;

        return (
            <Tooltip title="Refresh" placement="bottom">
                <IconButton onClick={this.props.onClick} classes={{ root: classes.icon }}>
                    <RefreshIcon />
                </IconButton>
            </Tooltip>
        );
    }
}

export default withStyles(styles)(CustomRefreshToolbar);
