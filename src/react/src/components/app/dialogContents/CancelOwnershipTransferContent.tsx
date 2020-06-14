import * as React from 'react';
import { DialogActions, Button, DialogContentText, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { useState } from 'react';
import { closeDialog } from '../../../redux/actions/DialogActions';
import { connect } from 'react-redux';
import { User } from 'oidc-client';
import { ApplicationState } from '../../../stores';
import { UserProfile } from '../../../models/UserProfile';
import UserService from '../../../services/UserService';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import populateUsersHOC from '../hocs/PopulateUsersHOC';
import IUser from '../../../models/app/IUser';
import { OrganizationState } from '../../../redux/actions/OrganizationActions';
import ITransferPrimaryOwnershipModel from '../../../models/landing/ITransferPrimaryOwnershipModel';
var userService = new UserService();

interface TransferOwnershipContentProps extends WithSnackbarProps {
    user: User;
    users: IUser[];
    closeDialog: () => void;
    domain: OrganizationState;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
        users: state.usersState.users.filter((u) => u.emailConfirmed === true && u.email !== (state.oidc.user.profile as UserProfile).email),
        domain: state.organizationState,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
    };
};

function TransferOwnershipContent(transferOwnershipContentProps: TransferOwnershipContentProps): JSX.Element {
    const [serverError, setServerError] = useState(undefined as string);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOnClick = () => {
        setIsSubmitting(true);
        userService
            .cancelPrimaryOwnershipTransfer({
                CorrelationId: transferOwnershipContentProps.domain.pendingPrimaryOwnerTransfer.correlationId,
            } as ITransferPrimaryOwnershipModel)
            .then((v) => {
                if (v.isError) {
                    setServerError('Failed to submit the cancellation request.');
                    transferOwnershipContentProps.enqueueSnackbar(v.error.message, { variant: 'error' });
                } else {
                    setSuccess(true);
                    transferOwnershipContentProps.enqueueSnackbar(v.message, { variant: 'success' });
                    transferOwnershipContentProps.closeDialog();
                }
            });
    };

    return (
        <React.Fragment>
            <DialogTitle>Cancel Primary Ownership Transfer</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to cancel the transfer of the Primary Owner role to
                    {transferOwnershipContentProps.domain.pendingPrimaryOwnerTransfer.transferToEmail}?
                </DialogContentText>
                {serverError && <Typography color="error">{serverError}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button disabled={isSubmitting} onClick={transferOwnershipContentProps.closeDialog} color="primary" variant="text">
                    Cancel
                </Button>
                <FormikSynchronousButton onClick={handleOnClick} denseMargin isSuccess={success} isValid={true} isSubmitting={isSubmitting} variant="text">
                    Cancel Primary Ownership Transfer
                </FormikSynchronousButton>
            </DialogActions>
        </React.Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(populateUsersHOC(TransferOwnershipContent)));
