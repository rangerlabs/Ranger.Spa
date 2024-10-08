import * as React from 'react';
import { Button, withStyles, createStyles, Theme, WithStyles } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

const styles = (theme: Theme) =>
    createStyles({
        root: { marginTop: theme.spacing(3), marginLeft: theme.spacing(1) },
    });

interface FormikCancelButtonProps extends WithStyles<typeof styles> {
    isSubmitting: boolean;
    onClick: () => void;
}

class FormikCancelButton extends React.Component<FormikCancelButtonProps & ButtonProps> {
    render() {
        const { isSubmitting, classes, onClick, ...rest } = this.props;
        return (
            <Button className={classes.root} onClick={onClick} disabled={isSubmitting} {...rest}>
                Cancel
            </Button>
        );
    }
}

export default withStyles(styles)(FormikCancelButton);
