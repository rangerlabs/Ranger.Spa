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
        this.props.openDialog(new DialogContent(dialogContent, dialogTitle, confirmText, onConfirm, onCancel));
    };

    render() {
        const { isSubmitting, dialogTitle, dialogContent, confirmText, onConfirm, onCancel, openDialog, ...rest } = this.props;
        return (
            <FormikDestructiveButton onClick={this.renderDialog} variant="outlined" {...rest}>
                {this.props.children}
            </FormikDestructiveButton>
        );
    }
}

export default connect(null, mapDispatchToProps)(FormikDeleteButton);
