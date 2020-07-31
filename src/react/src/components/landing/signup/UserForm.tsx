import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Formik, FormikBag, FormikProps } from 'formik';
import IUserForm from '../../../models/landing/IUserForm';
import FormikTextField from '../../form/FormikTextField';
import * as Yup from 'yup';
import FormikNextButton from '../../form/FormikNextButton';
import FormikBackButton from '../../form/FormikBackButton';
import RegularExpressions from '../../../helpers/RegularExpressions';

interface UserFormProps {
    handleNext: () => void;
    handleBack: () => void;
    setSignUpUserStateValues: (userFormValues: IUserForm) => void;
    buttonsClassName: string;
    userForm: IUserForm;
}

export default class UserForm extends React.Component<UserFormProps> {
    validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(1, 'Min 1 character')
            .max(48, 'Max 48 characters')
            .matches(new RegExp(RegularExpressions.NAME), "Must contain alphabetic character. May contain one of the following (_) (-) (,) (') (.).")
            .required('Required'),
        lastName: Yup.string()
            .min(1, 'Min 1 character')
            .max(48, 'Max 48 characters')
            .matches(new RegExp(RegularExpressions.NAME), "Must contain alphabetic character. May contain one of the following (_) (-) (,) (') (.).")
            .required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string()
            .min(8, 'Min 8 characters')
            .max(64, 'Max 64 characters')
            .matches(new RegExp(RegularExpressions.PASSWORD_SPECIAL_CHARACTER), 'Must contain at least 1 special character')
            .matches(new RegExp(RegularExpressions.PASSWORD_NUMBER), 'Must contain at least 1 number')
            .matches(new RegExp(RegularExpressions.PASSWORD_LOWERCASE_LETTER), 'Must contain at least 1 lowercase letter')
            .matches(new RegExp(RegularExpressions.PASSWORD_UPPERCASE_LETTER), 'Must contain at least 1 uppercase letter')
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    render() {
        const { buttonsClassName, userForm } = this.props;
        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        email: userForm.email ? userForm.email : '',
                        firstName: userForm.firstName ? userForm.firstName : '',
                        lastName: userForm.lastName ? userForm.lastName : '',
                        password: '',
                        confirmPassword: '',
                    }}
                    onSubmit={(values: IUserForm, formikBag: FormikBag<FormikProps<IUserForm>, IUserForm>) => {
                        const newUserForm = {
                            email: values.email,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            password: values.password,
                            confirmPassword: values.confirmPassword,
                        } as IUserForm;
                        this.props.setSignUpUserStateValues(newUserForm);
                        this.props.handleNext();
                    }}
                    validationSchema={this.validationSchema}
                >
                    {(props) => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="firstName"
                                        label="Firstname"
                                        value={props.values.firstName}
                                        errorText={props.errors.firstName}
                                        touched={props.touched.firstName}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="lastName"
                                        label="Lastname"
                                        value={props.values.lastName}
                                        errorText={props.errors.lastName}
                                        touched={props.touched.lastName}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="email"
                                        label="Email"
                                        type="email"
                                        value={props.values.email}
                                        errorText={props.errors.email}
                                        touched={props.touched.email}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="password"
                                        label="Password"
                                        value={props.values.password}
                                        errorText={props.errors.password}
                                        touched={props.touched.password}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        autoComplete="off"
                                        type="password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="confirmPassword"
                                        label="Confirm password"
                                        value={props.values.confirmPassword}
                                        errorText={props.errors.confirmPassword}
                                        touched={props.touched.confirmPassword}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        autoComplete="off"
                                        type="password"
                                    />
                                </Grid>
                            </Grid>

                            <div className={buttonsClassName}>
                                <FormikBackButton onClick={this.props.handleBack} />
                                <FormikNextButton isValid={props.isValid} />
                            </div>
                        </form>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}
