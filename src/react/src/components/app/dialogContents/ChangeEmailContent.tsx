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
import { IRestResponse } from '../../../services/RestUtilities';
var userService = new UserService();

interface ChangeEmailContentProps extends WithSnackbarProps {
    user: User;
    closeDialog: () => void;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
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

function ChangeEmailContent(changeEmailContentProps: ChangeEmailContentProps): JSX.Element {
    const [serverError, setServerError] = useState(undefined as string);
    const [success, setSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Required').email('Must be a valid email address'),
    });

    return (
        <React.Fragment>
            <Formik
                initialValues={{ email: '' }}
                onSubmit={(values: IRequestEmailChangeModel, formikBag: FormikBag<FormikProps<IRequestEmailChangeModel>, IRequestEmailChangeModel>) => {
                    setServerError(undefined);
                    userService
                        .requestEmailChanage((changeEmailContentProps.user.profile as UserProfile).email, values)
                        .then((response: IRestResponse<boolean>) => {
                            if (!response.isError) {
                                if (response.result) {
                                    changeEmailContentProps.enqueueSnackbar(response.message, { variant: 'success' });
                                    setSuccess(true);
                                    changeEmailContentProps.closeDialog();
                                }
                            } else {
                                changeEmailContentProps.enqueueSnackbar(response.error.message, {
                                    variant: 'error',
                                });
                                setServerError('The email address is already in use.');
                                formikBag.setSubmitting(false);
                            }
                        });
                }}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <DialogTitle>Change account email</DialogTitle>
                        <form onSubmit={props.handleSubmit}>
                            <DialogContent>
                                <DialogContentText>Please enter your new email address.</DialogContentText>
                                <FormikTextField
                                    name="email"
                                    label="Email"
                                    value={props.values.email}
                                    errorText={props.errors.email}
                                    touched={props.touched.email}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                    required
                                />
                                {serverError && <Typography color="error">{serverError}</Typography>}
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={props.isSubmitting} onClick={changeEmailContentProps.closeDialog} color="primary" variant="text">
                                    Cancel
                                </Button>
                                <FormikSynchronousButton
                                    denseMargin
                                    isSuccess={success}
                                    isValid={props.isValid}
                                    isSubmitting={props.isSubmitting}
                                    variant="text"
                                >
                                    Request Email Change
                                </FormikSynchronousButton>
                            </DialogActions>
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(ChangeEmailContent));
