import * as React from 'react';
import { Button, withStyles, createStyles, Theme, WithStyles } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { openDialog, DialogContent } from '../../redux/actions/DialogActions';
import { red } from '@material-ui/core/colors';
import { connect } from 'react-redux';

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

interface FormikDeleteButtonProps extends WithStyles<typeof styles> {
    isSubmitting: boolean;
    dialogTitle: string;
    dialogContent?: JSX.Element | string;
    confirmText?: string;
    onConfirm?: Function;
    onCancel?: Function;
    openDialog: (dialogContent: DialogContent) => void;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(dialogContent);
            dispatch(action);
        },
    };
};

class FormikDeleteButton extends React.Component<FormikDeleteButtonProps & ButtonProps> {
    renderDialog = () => {
        const { dialogTitle, dialogContent, confirmText, onConfirm, onCancel } = this.props;
        this.props.openDialog(new DialogContent(dialogContent, dialogTitle, confirmText, onConfirm, onCancel));
    };

    render() {
        const { isSubmitting, dialogTitle, dialogContent, confirmText, classes, onConfirm, openDialog, variant, ...rest } = this.props;
        return (
            <Button
                TouchRippleProps={{ classes: { child: classes.child } }}
                className={classes.warning}
                onClick={this.renderDialog}
                disabled={isSubmitting}
                {...rest}
                variant="outlined"
            >
                {this.props.children}
            </Button>
        );
    }
}

export default withStyles(styles)(connect(null, mapDispatchToProps)(FormikDeleteButton));
