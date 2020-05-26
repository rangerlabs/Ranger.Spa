import * as React from 'react';
import {
    DialogActions,
    Button,
    InputAdornment,
    IconButton,
    DialogContentText,
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    DialogContent,
} from '@material-ui/core';
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
import UserManager from '../../../services/UserManager';
import { ApplicationState } from '../../../stores';
import { UserProfile } from '../../../models/UserProfile';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import GlobalConfig from '../../../helpers/GlobalConfig';

const userService = new UserService();

interface Password {
    password: string;
}

interface DeleteAccountContentProps extends WithSnackbarProps {
    closeDialog: () => void;
    push: typeof push;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

function DeleteAccountContent(deleteAccountContentProps: DeleteAccountContentProps): JSX.Element {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverErrors, setServerErrors] = useState(undefined as string[]);
    const [success, setSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, 'Must be at least 8 characters long')
            .matches(
                new RegExp('[\\-\\`\\~\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\_\\+\\=\\{\\}\\[\\]\\\\|\\;\\:\\\'\\"\\,\\<\\.\\>\\/\\?]'),
                'Must contain at least 1 special character'
            )
            .matches(new RegExp('[0-9]'), 'Must contain at least 1 number')
            .matches(new RegExp('[a-z]'), 'Must contain at least 1 lowercase letter')
            .matches(new RegExp('[A-Z]'), 'Must contain at least 1 uppercase letter')
            .required('Required'),
    });

    return (
        <React.Fragment>
            <Formik
                initialValues={{ password: '' }}
                onSubmit={(values: Password, formikBag: FormikBag<FormikProps<Password>, Password>) => {
                    userService.deleteAccount({ password: values.password }).then((response) => {
                        if (response.isError) {
                            deleteAccountContentProps.enqueueSnackbar(response.error.message, {
                                variant: 'error',
                            });
                        } else {
                            UserManager.removeUser();
                            deleteAccountContentProps.enqueueSnackbar(response.message, { variant: 'success' });
                            push(GlobalConfig.SPA_HOST);
                            setSuccess(true);
                        }
                        formikBag.setSubmitting(false);
                    });
                }}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <DialogTitle>Delete account?</DialogTitle>
                        <form onSubmit={props.handleSubmit}>
                            <DialogContent>
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
                                {serverErrors && (
                                    <List>
                                        <ListItem>
                                            {serverErrors.map((error) => (
                                                <ListItemText primary={error} />
                                            ))}
                                        </ListItem>
                                    </List>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={deleteAccountContentProps.closeDialog} color="primary" variant="text">
                                    Cancel
                                </Button>
                                <FormikSynchronousButton
                                    denseMargin
                                    isValid={props.isValid}
                                    isSubmitting={props.isSubmitting}
                                    isSuccess={success}
                                    variant="text"
                                >
                                    Delete account
                                </FormikSynchronousButton>
                            </DialogActions>
                        </form>
                    </React.Fragment>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default connect(null, mapDispatchToProps)(withSnackbar(DeleteAccountContent));
