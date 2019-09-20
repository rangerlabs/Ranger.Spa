import * as React from "react";
import { Button, withStyles, createStyles, Theme, WithStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { openDialog, DialogContent } from "../../redux/actions/DialogActions";
import { red } from "@material-ui/core/colors";
import { connect } from "react-redux";
import { DialogComponent } from "../app/dialogContents/DialogComponent";

const styles = (theme: Theme) =>
    createStyles({
        cssRoot: {
            marginTop: theme.spacing(3),
            color: theme.palette.getContrastText(red[600]),
            backgroundColor: red[600],
            "&:hover": {
                backgroundColor: red[900],
            },
        },
        warning: {
            marginTop: theme.spacing(3),
            color: red[600],
        },
    });

interface FormikDeleteButtonProps extends WithStyles<typeof styles> {
    isSubmitting: boolean;
    dialogTitle: string;
    dialogContent?: DialogComponent | string;
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
        this.props.openDialog(new DialogContent(dialogTitle, dialogContent, confirmText, onConfirm, onCancel));
    };

    render() {
        const { isSubmitting, dialogTitle, dialogContent, confirmText, classes, onConfirm, openDialog, ...rest } = this.props;
        return (
            <Button className={classes.warning} onClick={this.renderDialog} disabled={isSubmitting} {...rest} variant="text">
                Delete
            </Button>
        );
    }
}

export default withStyles(styles)(
    connect(
        null,
        mapDispatchToProps
    )(FormikDeleteButton)
);
