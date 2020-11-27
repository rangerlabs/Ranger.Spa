import * as React from 'react';
import { Button, withStyles, createStyles, Theme, WithStyles } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';

const styles = (theme: Theme) =>
    createStyles({
        warning: {
            marginTop: theme.spacing(3),
            color: red[600],
            '&:hover': {
                backgroundColor: '#e539351c',
                color: theme.palette.error.main,
            },
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: red[600],
        },
        child: {
            backgroundColor: theme.palette.error.main,
        },
    });

interface FormikDestructiveButtonProps extends WithStyles<typeof styles> {
    isSubmitting: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

class FormikDestructiveButton extends React.Component<FormikDestructiveButtonProps & ButtonProps> {
    render() {
        const { isSubmitting, classes, variant, ...rest } = this.props;
        return (
            <Button
                TouchRippleProps={{ classes: { child: classes.child } }}
                className={classes.warning}
                onClick={this.props.onClick}
                disabled={isSubmitting}
                {...rest}
                variant="outlined"
            >
                {this.props.children}
            </Button>
        );
    }
}

export default withStyles(styles)(FormikDestructiveButton);
