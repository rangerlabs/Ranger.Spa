import * as React from 'react';
import { DialogActions, Button, InputAdornment, IconButton, DialogContentText, List, ListItem, ListItemText } from '@material-ui/core';
import { DialogComponentProps } from './DialogComponent';
import { useState } from 'react';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import FormikPrimaryButton from '../../form/FormikPrimaryButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

interface Password {
    password: string;
}

interface DeleteAccountContentProps {
    email: string;
}

function DeleteAccountContent(dialogComponentProps: DialogComponentProps & DeleteAccountContentProps): JSX.Element {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverErrors, setServerErrors] = useState(undefined as string[]);

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, 'Must be at least 8 characters long')
            .matches(new RegExp('[!@#\\$%\\^\\&*\\)\\(+=._-]'), 'Must contain at least 1 special character')
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
                    console.log(values);
                    setServerErrors(undefined);
                    // userService.postUser(newUser).then((response: IRestResponse<IUser>) => {
                    //     setTimeout(() => {
                    //         if (response.is_error) {
                    //             const { serverErrors, ...formikErrors } = response.error_content.errors;
                    //             enqueueSnackbar("Error creating user", { variant: "error" });
                    //             formikBag.setErrors(formikErrors as FormikErrors<IUser>);
                    //             this.setState({ serverErrors: serverErrors });
                    //             formikBag.setSubmitting(false);
                    //         } else {
                    //             enqueueSnackbar("User created", { variant: "success" });
                    //             setTimeout(this.props.closeForm, 500);
                    //             dispatchAddUser(response.content);
                    //         }
                    //     }, 2000);
                    // });
                }}
                validationSchema={validationSchema}
            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <DialogContentText>To delete your account, please confirm your password.</DialogContentText>
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
                            {...(serverErrors && (
                                <List>
                                    <ListItem>
                                        {serverErrors.map(error => (
                                            <ListItemText primary={error} />
                                        ))}
                                    </ListItem>
                                </List>
                            ))}
                        />
                        <DialogActions>
                            <Button onClick={dialogComponentProps.onClose} color="primary" variant="text">
                                Cancel
                            </Button>
                            <FormikPrimaryButton denseMargin isValid={props.isValid} isSubmitting={props.isSubmitting} variant="text">
                                Delete account
                            </FormikPrimaryButton>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default DeleteAccountContent;
