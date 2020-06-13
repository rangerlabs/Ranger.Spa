import * as React from 'react';
import { DialogActions, Button, InputAdornment, IconButton, DialogContentText, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { useState } from 'react';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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

interface ChangePasswordContentProps extends WithSnackbarProps {
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

function ChangePasswordContent(changePasswordContentProps: ChangePasswordContentProps): JSX.Element {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState(undefined as string);
    const [success, setSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        password: Yup.string().required('Required'),
    });

    return (
        <React.Fragment>
            <Formik
                initialValues={{ password: '' }}
                onSubmit={(values: IRequestPasswordResetModel, formikBag: FormikBag<FormikProps<IRequestPasswordResetModel>, IRequestPasswordResetModel>) => {
                    setServerError(undefined);
                    userService.requestPasswordReset(values).then((response: IRestResponse<boolean>) => {
                        if (!response.isError) {
                            changePasswordContentProps.enqueueSnackbar(response.message);
                            formikBag.setSubmitting(false);
                            setSuccess(true);
                            changePasswordContentProps.closeDialog();
                        } else {
                            setServerError(response.error.message);
                            changePasswordContentProps.enqueueSnackbar(response.message, { variant: 'error' });
                            formikBag.setSubmitting(false);
                        }
                    });
                }}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <DialogTitle>Change account password</DialogTitle>
                        <form onSubmit={props.handleSubmit}>
                            <DialogContent>
                                <DialogContentText>To change your password, please enter your current password.</DialogContentText>
                                <FormikTextField
                                    name="password"
                                    label="Password"
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={props.values.password}
                                    errorText={props.errors.password}
                                    touched={props.touched.password}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Toggle password visibility"
                                                    onClick={() => {
                                                        setPasswordVisible(!passwordVisible);
                                                    }}
                                                >
                                                    {passwordVisible ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {serverError && <Typography color="error">{serverError}</Typography>}
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={props.isSubmitting} onClick={changePasswordContentProps.closeDialog} color="primary" variant="text">
                                    Cancel
                                </Button>
                                <FormikSynchronousButton
                                    denseMargin
                                    isSuccess={success}
                                    isValid={props.isValid}
                                    isSubmitting={props.isSubmitting}
                                    variant="text"
                                >
                                    Request Password Reset
                                </FormikSynchronousButton>
                            </DialogActions>
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(ChangePasswordContent));
