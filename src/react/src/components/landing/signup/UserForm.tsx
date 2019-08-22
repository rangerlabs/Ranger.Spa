import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { Formik, FormikBag, FormikProps } from "formik";
import IUserForm from "../../../models/landing/IUserForm";
import FormikTextField from "../../form/FormikTextField";
import * as Yup from "yup";
import FormikNextButton from "../../form/FormikNextButton";
import FormikBackButton from "../../form/FormikBackButton";

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
            .min(1, "Must be at least 1 character long")
            .max(48, "Max 48 characters")
            .matches(
                new RegExp("^[a-zA-Z,.'-]{1}[a-zA-Z ,.'-]{1,26}[a-zA-Z,.'-]{1}$"),
                "Valid characters are A-Z, spaces ( ) commas (,), periods (.), apostraphes ('), and hyphens (-)"
            )
            .required("Required"),
        lastName: Yup.string()
            .min(1, "Must be at least 1 character long")
            .max(48, "Max 48 characters")
            .matches(
                new RegExp("^[a-zA-Z,.'-]{1}[a-zA-Z ,.'-]{1,26}[a-zA-Z,.'-]{1}$"),
                "Valid characters are A-Z, spaces ( ) commas (,), periods (.), apostraphes ('), and hyphens (-)"
            )
            .required("Required"),
        email: Yup.string()
            .email("Invalid email")
            .required("Required"),
        password: Yup.string()
            .min(8, "Must be at least 8 characters long")
            .matches(new RegExp("[!@#\\$%\\^\\&*\\)\\(+=._-]"), "Must contain at least 1 special character")
            .matches(new RegExp("[0-9]"), "Must contain at least 1 number")
            .matches(new RegExp("[a-z]"), "Must contain at least 1 lowercase letter")
            .matches(new RegExp("[A-Z]"), "Must contain at least 1 uppercase letter")
            .required("Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Required"),
    });

    render() {
        const { buttonsClassName, userForm } = this.props;
        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        email: userForm.email ? userForm.email : "",
                        firstName: userForm.firstName ? userForm.firstName : "",
                        lastName: userForm.lastName ? userForm.lastName : "",
                        password: "",
                        confirmPassword: "",
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
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid container spacing={24}>
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
