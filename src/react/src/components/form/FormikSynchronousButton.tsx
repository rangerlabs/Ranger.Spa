import * as React from 'react';
import { Button, withStyles, createStyles, Theme, WithStyles } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Progress from '../loading/Progress';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(3),
            marginLeft: theme.spacing(1),
            position: 'relative',
        },
        buttonSuccess: {
            backgroundColor: green[500],
            '&:hover': {
                backgroundColor: green[700],
            },
        },
        denseMargin: { marginLeft: theme.spacing(1), position: 'relative' },
    });

interface FormikSynchronousButtonProps extends WithStyles<typeof styles> {
    denseMargin?: boolean;
    isValid: boolean;
    isSubmitting: boolean;
    isSuccess: boolean;
    disabled?: boolean;
}

class FormikSynchronousButton extends React.Component<FormikSynchronousButtonProps & ButtonProps> {
    render() {
        const { denseMargin, isValid, isSubmitting, isSuccess, classes, disabled, ...rest } = this.props;
        return (
            <div className={denseMargin ? classes.denseMargin : classes.root}>
                <Button
                    className={isSuccess ? classes.buttonSuccess : ''}
                    disabled={disabled ? disabled : false || !isValid || isSubmitting}
                    type="submit"
                    color="primary"
                    variant="contained"
                    {...rest}
                >
                    {this.props.children}
                </Button>
                {isSubmitting && !isSuccess && <Progress />}
            </div>
        );
    }
}

export default withStyles(styles)(FormikSynchronousButton);
