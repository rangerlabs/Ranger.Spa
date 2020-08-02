import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import FormikBackButton from '../../form/FormikBackButton';
import IReviewForm from '../../../models/landing/IReviewForm';
import { InputAdornment, Typography, Theme, createStyles, makeStyles } from '@material-ui/core';
import TenantService from '../../../services/TenantService';
import { IRestResponse } from '../../../services/RestUtilities';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import { useState } from 'react';

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
    const { handleBack, buttonsClassName, reviewForm } = props;

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
                        },
                    } as IReviewForm;
                    tenantService.post(reviewForm).then((result: IRestResponse<void>) => {
                        if (!result.isError) {
                            setIsSuccess(true);
                            props.handleNext();
                        } else {
                        }
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
                        </Grid>
                        <div className={buttonsClassName}>
                            <FormikBackButton onClick={handleBack} />
                            <FormikSynchronousButton isSuccess={isSuccess} isValid={true} isSubmitting={props.isSubmitting} variant="contained">
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
