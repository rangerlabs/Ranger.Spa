import * as React from 'react';
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { DialogState, closeDialog } from '../../redux/actions/DialogActions';
import { ApplicationState } from '../../stores';
import { isString } from 'util';

interface DialogProps {
    dialog: DialogState;
    onClose: any;
}

const mapStateToProps = (state: ApplicationState) => {
    return { dialog: state.dialog };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onClose: () => {
            const action = closeDialog();
            dispatch(action);
        },
    };
};

class Dialog extends React.Component<DialogProps> {
    render() {
        const { dialog, onClose } = this.props;
        return dialog.visible ? (
            <MuiDialog open onClose={onClose}>
                {!isString(dialog.content.content) ? (
                    dialog.content.content
                ) : (
                    <React.Fragment>
                        <DialogTitle id="form-dialog-title">{dialog.content.title}</DialogTitle>
                        <DialogContent>
                            <React.Fragment>
                                <DialogContentText>{dialog.content.content}</DialogContentText>
                                <DialogActions>
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            if (dialog.content.cancelAction) {
                                                dialog.content.cancelAction();
                                            }
                                        }}
                                        color="primary"
                                        variant="text"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            if (dialog.content.confirmAction) {
                                                dialog.content.confirmAction();
                                            }
                                        }}
                                        color="primary"
                                        variant="text"
                                    >
                                        {dialog.content.confirmText}
                                    </Button>
                                </DialogActions>
                            </React.Fragment>
                        </DialogContent>
                    </React.Fragment>
                )}
            </MuiDialog>
        ) : null;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dialog);
