import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Button, WithStyles, Theme, createStyles, withStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
    });
interface CustomAddToolbarProps extends WithStyles<typeof styles> {
    onClick: () => void;
}

class CustomAddToolbar extends React.Component<CustomAddToolbarProps> {
    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Button className={classes.button} color="primary" variant="contained" onClick={this.props.onClick}>
                    <AddIcon className={classes.leftIcon} />
                    New
                </Button>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(CustomAddToolbar);
