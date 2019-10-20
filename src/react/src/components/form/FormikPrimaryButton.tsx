import * as React from 'react';
import { Button, withStyles, createStyles, Theme, WithStyles } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

const styles = (theme: Theme) =>
    createStyles({
        root: { marginTop: theme.spacing(3), marginLeft: theme.spacing(1) },
    });

interface FormikPrimaryButtonProps extends WithStyles<typeof styles> {
    denseMargin?: boolean;
    isValid: boolean;
    isSubmitting: boolean;
    variant: 'outlined' | 'contained' | 'text';
}

class FormikPrimaryButton extends React.Component<FormikPrimaryButtonProps & ButtonProps> {
    render() {
        const { isValid, isSubmitting, classes, variant, denseMargin, ...rest } = this.props;
        return (
            <Button className={denseMargin ? '' : classes.root} disabled={!isValid || isSubmitting} type="submit" color="primary" variant={variant} {...rest}>
                {this.props.children ? this.props.children : 'Create'}
            </Button>
        );
    }
}

export default withStyles(styles)(FormikPrimaryButton);
