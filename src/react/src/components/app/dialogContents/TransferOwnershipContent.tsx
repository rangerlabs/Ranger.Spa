import * as React from 'react';
import { DialogActions, Button, DialogContentText, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { useState } from 'react';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import { closeDialog } from '../../../redux/actions/DialogActions';
import { connect } from 'react-redux';
import { User } from 'oidc-client';
import { ApplicationState } from '../../../stores';
import { UserProfile } from '../../../models/UserProfile';
import UserService from '../../../services/UserService';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import populateUsersHOC from '../hocs/PopulateUsersHOC';
import FormikAutocompleteSearch from '../../form/FormikAutocompleteSearch';
import IUser from '../../../models/app/IUser';
var userService = new UserService();

interface TransferOwnershipContentProps extends WithSnackbarProps {
    user: User;
    users: IUser[];
    closeDialog: () => void;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
        users: state.usersState.users.filter((u) => u.emailConfirmed === true && u.email !== (state.oidc.user.profile as UserProfile).email),
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

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Required').email('Must be a valid email address'),
    });

    return (
        <React.Fragment>
            <Formik
                initialValues={{ email: '' }}
                onSubmit={(values: ITransferOwnershipModel, formikBag: FormikBag<FormikProps<ITransferOwnershipModel>, ITransferOwnershipModel>) => {
                    userService.transferPrimaryOwnership(values).then((v) => {
                        if (v.isError) {
                            setServerError(v.error.message);
                            transferOwnershipContentProps.enqueueSnackbar(v.error.message, { variant: 'error' });
                        }
                        formikBag.setSubmitting(false);
                        transferOwnershipContentProps.enqueueSnackbar(v.message, { variant: 'success' });
                        transferOwnershipContentProps.closeDialog();
                    });
                }}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <DialogTitle>Transfer Primary Ownership</DialogTitle>
                        <form onSubmit={props.handleSubmit}>
                            <DialogContent>
                                <DialogContentText> Please enter the email address of the user you want to transfer primary ownership to.</DialogContentText>
                                <DialogContentText color="error">
                                    Once the transfer is accepted by the user you will be assigned the role of Owner and the new Primary Owner may further
                                    demote you.
                                </DialogContentText>
                                <FormikAutocompleteSearch
                                    name="email"
                                    label="Email"
                                    renderOption={(option: string) => <Typography variant="subtitle1">{option}</Typography>}
                                    options={transferOwnershipContentProps.users.map((u) => u.email)}
                                    errorText={props.errors.email}
                                    touched={props.touched.email}
                                    onChange={(event: React.ChangeEvent<{}>, values: string) => {
                                        props.setFieldValue('email', values, true);
                                    }}
                                    onBlur={props.handleBlur}
                                    required
                                />
                                {serverError && <Typography color="error">{serverError}</Typography>}
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={props.isSubmitting} onClick={transferOwnershipContentProps.closeDialog} color="primary" variant="text">
                                    Cancel
                                </Button>
                                <FormikSynchronousButton
                                    denseMargin
                                    isSuccess={success}
                                    isValid={props.isValid}
                                    isSubmitting={props.isSubmitting}
                                    variant="text"
                                >
                                    Transfer Primary Ownership
                                </FormikSynchronousButton>
                            </DialogActions>
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(populateUsersHOC(TransferOwnershipContent)));
