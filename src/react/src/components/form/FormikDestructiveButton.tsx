import * as React from 'react';
import { Button, withStyles, createStyles, Theme, WithStyles } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import Progress from '../loading/Progress';
const classNames = require('classnames').default;

const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(3),
        },
        warning: {
            color: red[600],
            '&:hover': {
                backgroundColor: '#e539351c',
                color: theme.palette.error.main,
            },
        },
        child: {
            backgroundColor: theme.palette.error.main,
        },
        borders: {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: red[600],
        },
        denseMargin: { marginTop: theme.spacing(1), position: 'relative' },
    });

interface FormikDestructiveButtonProps extends WithStyles<typeof styles> {
    denseMargin?: boolean;
    isValid: boolean;
    isSubmitting?: boolean;
    isSuccess?: boolean;
    variant: 'text' | 'outlined';
}

class FormikDestructiveButton extends React.Component<FormikDestructiveButtonProps & ButtonProps> {
    getClasses() {
        const { classes, denseMargin, variant } = this.props;
        if (denseMargin && variant === 'text') {
            return classNames(classes.warning, classes.denseMargin);
        } else if (!this.props.denseMargin && variant === 'text') {
            return classNames(classes.warning);
        } else if (denseMargin && variant === 'outlined') {
            classNames(classes.warning, classes.root, classes.denseMargin, classes.borders);
        } else if (!denseMargin && variant === 'outlined') {
            classNames(classes.warning, classes.root, classes.borders);
        }
    }

    render() {
        const { classes, variant, disabled, isValid, isSubmitting, denseMargin, isSuccess, ...rest } = this.props;
        return (
            <div className={denseMargin ? classes.denseMargin : classes.root}>
                <Button
                    TouchRippleProps={{ classes: { child: classes.child } }}
                    className={this.getClasses()}
                    disabled={disabled ? disabled : false || !isValid || isSubmitting}
                    type="submit"
                    color="primary"
                    {...rest}
                >
                    {this.props.children}
                </Button>
                {isSubmitting && !isSuccess && <Progress />}
            </div>
        );
    }
}

export default withStyles(styles)(FormikDestructiveButton);
