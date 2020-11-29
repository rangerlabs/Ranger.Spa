import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import FormikTextField from '../../form/FormikTextField';
import { Formik } from 'formik';
import FormikBackButton from '../../form/FormikBackButton';
import IReviewForm from '../../../models/landing/IReviewForm';
import { InputAdornment, Typography, createStyles, makeStyles } from '@material-ui/core';
import TenantService from '../../../services/TenantService';
import { IRestResponse } from '../../../services/RestUtilities';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const tenantService = new TenantService();
const useStyles = makeStyles(() =>
    createStyles({
        gridItem: {
            paddingBottom: '0px !important',
        },
    })
);

interface ReviewProps {
    reviewForm: IReviewForm;
    buttonsClassName: string;
    handleNext: () => void;
    handleBack: () => void;
}

const Review = function (props: ReviewProps) {
    const classes = useStyles(props);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(undefined);
    const { handleBack, buttonsClassName, reviewForm } = props;
    const { executeRecaptcha } = useGoogleReCaptcha();

    return (
        <React.Fragment>
            <Formik
                initialValues={
                    {
                        organizationForm: reviewForm.organizationForm,
                        userForm: reviewForm.userForm,
                    } as IReviewForm
                }
                onSubmit={(values: IReviewForm) => {
                    setIsSubmitting(true);
                    setServerError(undefined);
                    executeRecaptcha('contact_page')
                        .then((token) => {
                            const reviewForm = {
                                organizationForm: {
                                    domain: values.organizationForm.domain,
                                    organizationName: values.organizationForm.organizationName,
                                },
                                userForm: {
                                    email: values.userForm.email,
                                    firstName: values.userForm.firstName,
                                    lastName: values.userForm.lastName,
                                    password: values.userForm.password,
                                    confirmPassword: values.userForm.confirmPassword,
                                    reCaptchaToken: token,
                                },
                            } as IReviewForm;
                            tenantService.post(reviewForm).then((result: IRestResponse<void>) => {
                                if (!result.isError) {
                                    setIsSuccess(true);
                                    props.handleNext();
                                } else {
                                }
                            });
                            setIsSubmitting(false);
                        })
                        .catch(() => {
                            setServerError('Failed to acquire reCaptcha token. Please try again.');
                            setIsSubmitting(false);
                        });
                }}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid classes={{ item: classes.gridItem }} item xs={12}>
                                <Typography variant="h6">Domain</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormikTextField
                                    disabled
                                    name="organizationForm.domain"
                                    label="Domain"
                                    value={props.initialValues.organizationForm.domain}
                                    errorText={''}
                                    touched={false}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    InputProps={{ endAdornment: <InputAdornment position="end">.rangerlabs.com</InputAdornment> }}
                                    autoComplete="off"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormikTextField
                                    disabled
                                    name="organizationForm.organizationName"
                                    label="Organization name"
                                    value={props.initialValues.organizationForm.organizationName}
                                    errorText={''}
                                    touched={false}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                />
                            </Grid>
                            <Grid classes={{ item: classes.gridItem }} item xs={12}>
                                <Typography variant="h6">User</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormikTextField
                                    disabled
                                    name="userForm.firstName"
                                    label="Firstname"
                                    value={props.initialValues.userForm.firstName}
                                    errorText={''}
                                    touched={false}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormikTextField
                                    disabled
                                    name="userForm.lastName"
                                    label="Lastname"
                                    value={props.initialValues.userForm.lastName}
                                    errorText={''}
                                    touched={false}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormikTextField
                                    disabled
                                    name="userForm.email"
                                    label="Email"
                                    type="email"
                                    value={props.initialValues.userForm.email}
                                    errorText={''}
                                    touched={false}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                />
                            </Grid>
                            {serverError && (
                                <Grid item xs={12}>
                                    <Typography color="error" variant="subtitle1">
                                        {serverError}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                        <div className={buttonsClassName}>
                            <FormikBackButton onClick={handleBack} />
                            <FormikSynchronousButton isSuccess={isSuccess} isValid={true} isSubmitting={isSubmitting} variant="contained">
                                Sign Up
                            </FormikSynchronousButton>
                        </div>
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
};

export default Review;
