import * as React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import { WithStyles, Theme, createStyles, withStyles, IconButton, Tooltip } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        leftIcon: {
            marginRight: theme.spacing(1),
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
                <IconButton onClick={this.props.onClick} color="primary">
                    <RefreshIcon />
                </IconButton>
            </Tooltip>
        );
    }
}

export default withStyles(styles)(CustomRefreshToolbar);
