import * as React from 'react';
import { ButtonProps } from '@material-ui/core/Button';
import { openDialog, DialogContent } from '../../redux/actions/DialogActions';
import { connect } from 'react-redux';
import FormikDestructiveButton from './FormikDestructiveButton';
import { PropsWithChildren } from 'react';

interface FormikDeleteButtonProps {
    isSubmitting: boolean;
    dialogTitle: string;
    dialogContent?: JSX.Element | string;
    confirmText?: string;
    disabled?: boolean;
    denseMargin?: boolean;
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

class FormikDeleteButton extends React.Component<PropsWithChildren<FormikDeleteButtonProps>> {
    renderDialog = () => {
        const { dialogTitle, dialogContent, confirmText, onConfirm, onCancel } = this.props;
        this.props.openDialog(new DialogContent(dialogContent, dialogTitle, confirmText, onConfirm, true, onCancel));
    };

    render() {
        const { isSubmitting, dialogTitle, dialogContent, denseMargin, confirmText, onConfirm, onCancel, openDialog, ...rest } = this.props;
        return (
            <FormikDestructiveButton isValid denseMargin={denseMargin} variant="outlined" onClick={this.renderDialog} type="button" {...rest}>
                {this.props.children}
            </FormikDestructiveButton>
        );
    }
}

export default connect(null, mapDispatchToProps)(FormikDeleteButton);
