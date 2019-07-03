import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { Formik, FormikBag, FormikProps } from "formik";
import FormikTextField from "../../form/FormikTextField";
import FormikNextButton from "../../form/FormikNextButton";
import IDomainForm from "../../../models/landing/IDomainForm";
import * as Yup from "yup";
import { InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

interface DomainFormProps {
    setSignUpDomainStateValues: (domainFormValues: IDomainForm) => void;
    handleNext: () => void;
    buttonsClassName: string;
    domainForm: IDomainForm;
}

type DomainFormState = {
    passwordVisible: boolean;
};

export default class DomainForm extends React.Component<DomainFormProps, DomainFormState> {
    state = {
        passwordVisible: false,
    };

    validationSchema = Yup.object().shape({
        domain: Yup.string()
            .min(4, "Must be at least 4 characters long")
            .max(28, "Must be less than 28 characters long")
            .matches(
                new RegExp("^[a-zA-Z0-9]{1}[a-zA-Z0-9-]{1,26}[a-zA-Z0-9]{1}$"),
                "Must begin, end, and contain alphanumeric characters. Hyphens (-) permitted."
            )
            .required("Required"),
        organizationName: Yup.string()
            .min(4, "Must be at least 3 characters long")
            .max(28, "Must be less than 28 characters long")
            .matches(
                new RegExp("^[a-zA-Z0-9]{1}[a-zA-Z0-9- ]{1,26}[a-zA-Z0-9]{1}$"),
                "Must begin, end, and contain alphanumeric characters. Spaces ( ) and hyphens (-) permitted."
            )
            .required("Required"),
    });

    render() {
        const { buttonsClassName, domainForm } = this.props;
        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        domain: domainForm.domain ? domainForm.domain : "",
                        organizationName: domainForm.organizationName ? domainForm.organizationName : "",
                    }}
                    onSubmit={(values: IDomainForm, formikBag: FormikBag<FormikProps<IDomainForm>, IDomainForm>) => {
                        const newDomain = {
                            domain: values.domain,
                            organizationName: values.organizationName,
                        } as IDomainForm;
                        this.props.setSignUpDomainStateValues(newDomain);
                        this.props.handleNext();
                    }}
                    validationSchema={this.validationSchema}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid container spacing={24}>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="domain"
                                        label="Domain"
                                        value={props.values.domain}
                                        errorText={props.errors.domain}
                                        touched={props.touched.domain}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        InputProps={{ endAdornment: <InputAdornment position="end">.rangerlabs.io</InputAdornment> }}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="organizationName"
                                        label="Organization name"
                                        value={props.values.organizationName}
                                        errorText={props.errors.organizationName}
                                        touched={props.touched.organizationName}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        autoComplete="off"
                                    />
                                </Grid>
                            </Grid>
                            <div className={buttonsClassName}>
                                <FormikNextButton isValid={props.isValid} type="submit" />
                            </div>
                        </form>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}
