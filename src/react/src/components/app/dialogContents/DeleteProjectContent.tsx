import * as React from 'react';
import { DialogActions, Button, InputAdornment, IconButton, DialogContentText, List, ListItem, ListItemText } from '@material-ui/core';
import { DialogComponentProps } from './DialogComponent';
import { useState, useEffect } from 'react';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import FormikPrimaryButton from '../../form/FormikPrimaryButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as queryString from 'query-string';
import IProject from '../../../models/app/IProject';

function DeleteProjectContent(dialogComponentProps: DialogComponentProps): JSX.Element {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverErrors, setServerErrors] = useState(undefined as string[]);
    const [projectName, setProjectName] = useState('');

    useEffect(() => {
        const params = queryString.parse(window.location.search);
        setProjectName(params['name'] as string);
    });

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(new RegExp(`${projectName}`))
            .required('Required'),
    });

    return (
        <React.Fragment>
            <Formik
                initialValues={{ name: '' }}
                onSubmit={(values: Partial<IProject>, formikBag: FormikBag<FormikProps<Partial<IProject>>, Partial<IProject>>) => {
                    console.log(values);
                    console.log(`Delete Project ${values.name}`);
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
                        <DialogContentText>To delete this project please confirm the project's name.</DialogContentText>
                        <FormikTextField
                            name="name"
                            label="Project Name"
                            value={props.values.name}
                            errorText={props.errors.name}
                            touched={props.touched.name}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            autoComplete="off"
                            required
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
                            <FormikPrimaryButton isValid={props.isValid} isSubmitting={props.isSubmitting} variant="text">
                                Delete project
                            </FormikPrimaryButton>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
}

export default DeleteProjectContent;
