import * as React from 'react';
import { DialogActions, Button, InputAdornment, IconButton, DialogContentText, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import { useState } from 'react';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { closeDialog } from '../../../redux/actions/DialogActions';
import { connect } from 'react-redux';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import UserService from '../../../services/UserService';
import { push } from 'connected-react-router';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import GlobalConfig from '../../../helpers/GlobalConfig';
import RegularExpressions from '../../../helpers/RegularExpressions';
import { setAccountDeleting } from '../../../redux/actions/AccountActions';
import { ApplicationState } from '../../../stores';
import Progress from '../../loading/Progress';
import FormikDestructiveButton from '../../form/FormikDestructiveButton';

const userService = new UserService();

interface Password {
    password: string;
}

interface DeleteAccountContentProps extends WithSnackbarProps {
    closeDialog: () => void;
    setIsDeleting: (value: boolean) => void;
    push: typeof push;
    isDeleting: boolean;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
        setIsDeleting: (value: boolean) => {
            const action = setAccountDeleting(value);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return {
        isDeleting: state.accountState.isDeleting,
    };
};

function DeleteAccountContent(deleteAccountContentProps: DeleteAccountContentProps): JSX.Element {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState(undefined as string);
    const [success, setSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, 'Min 8 characters')
            .max(64, 'Max 64 characters')
            .matches(new RegExp(RegularExpressions.PASSWORD_SPECIAL_CHARACTER), 'Must contain at least 1 special character')
            .matches(new RegExp(RegularExpressions.PASSWORD_NUMBER), 'Must contain at least 1 number')
            .matches(new RegExp(RegularExpressions.PASSWORD_LOWERCASE_LETTER), 'Must contain at least 1 lowercase letter')
            .matches(new RegExp(RegularExpressions.PASSWORD_UPPERCASE_LETTER), 'Must contain at least 1 uppercase letter')
            .required('Required'),
    });

    return (
        <React.Fragment>
            <Formik
                initialValues={{ password: '' }}
                onSubmit={(values: Password, formikBag: FormikBag<FormikProps<Password>, Password>) => {
                    userService.deleteAccount({ password: values.password }).then((response) => {
                        if (response.isError) {
                            setServerError(response.error.message);
                            deleteAccountContentProps.enqueueSnackbar(response.error.message, {
                                variant: 'error',
                            });
                        } else {
                            push(GlobalConfig.SPA_HOST);
                            deleteAccountContentProps.setIsDeleting(true);
                        }
                        formikBag.setSubmitting(false);
                    });
                }}
                validateOnMount={false}
                isInitialValid={false}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <DialogTitle>Delete your account?</DialogTitle>
                        <form onSubmit={props.handleSubmit}>
                            <DialogContent>
                                {deleteAccountContentProps.isDeleting ? (
                                    <React.Fragment>
                                        <DialogContentText>Your request has been submitted. Please wait while the operation completes.</DialogContentText>
                                        <Progress />
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <DialogContentText color="error">To delete your account please confirm your password.</DialogContentText>
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
                                    </React.Fragment>
                                )}
                            </DialogContent>
                            {!deleteAccountContentProps.isDeleting && (
                                <DialogActions>
                                    <Button
                                        disabled={deleteAccountContentProps.isDeleting}
                                        onClick={deleteAccountContentProps.closeDialog}
                                        color="primary"
                                        variant="text"
                                    >
                                        Cancel
                                    </Button>
                                    <FormikDestructiveButton
                                        denseMargin
                                        isValid={props.isValid}
                                        isSubmitting={props.isSubmitting || deleteAccountContentProps.isDeleting}
                                        isSuccess={false}
                                        variant="text"
                                    >
                                        Delete account
                                    </FormikDestructiveButton>
                                </DialogActions>
                            )}
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(DeleteAccountContent));
