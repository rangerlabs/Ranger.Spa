import * as React from "react";
import { withStyles, createStyles, Theme, WithStyles } from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";
import { connect } from "react-redux";
import { openDialog, DialogContent } from "../../redux/actions/DialogActions";

const styles = (theme: Theme) =>
    createStyles({
        root: { marginTop: theme.spacing.unit * 3, marginLeft: theme.spacing.unit },
    });

interface FormikDialogConfirmButtonProps extends WithStyles<typeof styles> {
    isSubmitting: boolean;
    dialogTitle: string;
    dialogContent: string;
    confirmText: string;
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

class FormikDialogConfirmButton extends React.Component<FormikDialogConfirmButtonProps & ButtonProps> {
    renderDialog = () => {
        const { dialogTitle, dialogContent, confirmText, onConfirm, onCancel } = this.props;
        this.props.openDialog(new DialogContent(dialogTitle, dialogContent, confirmText, onConfirm, onCancel));
    };

    render() {
        const { isSubmitting, dialogTitle, dialogContent, confirmText, classes, onConfirm, openDialog, ...rest } = this.props;
        return (
            <Button className={classes.root} onClick={this.renderDialog} {...rest}>
                {this.props.children}
            </Button>
        );
    }
}

export default withStyles(styles)(
    connect(
        null,
        mapDispatchToProps
    )(FormikDialogConfirmButton)
);
