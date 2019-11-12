import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import FormikTextField from '../../form/FormikTextField';
import { Formik, FormikBag, FormikProps } from 'formik';
import FormikBackButton from '../../form/FormikBackButton';
import FormikPrimaryButton from '../../form/FormikPrimaryButton';
import IReviewForm from '../../../models/landing/IReviewForm';
import { InputAdornment, Typography, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import TenantService from '../../../services/TenantService';

const tenantService = new TenantService();
const styles = (theme: Theme) =>
    createStyles({
        gridItem: {
            paddingBottom: '0px !important',
        },
    });

interface ReviewProps extends WithStyles<typeof styles> {
    reviewForm: IReviewForm;
    buttonsClassName: string;
    handleNext: () => void;
    handleBack: () => void;
}

class Review extends React.Component<ReviewProps> {
    render() {
        const { classes, buttonsClassName, reviewForm } = this.props;
        return (
            <React.Fragment>
                <Formik
                    initialValues={
                        {
                            domainForm: reviewForm.domainForm,
                            userForm: reviewForm.userForm,
                        } as IReviewForm
                    }
                    onSubmit={(values: IReviewForm, formikBag: FormikBag<FormikProps<IReviewForm>, IReviewForm>) => {
                        const reviewForm = {
                            domainForm: {
                                domain: values.domainForm.domain,
                                organizationName: values.domainForm.organizationName,
                            },
                            userForm: {
                                email: values.userForm.email,
                                firstName: values.userForm.firstName,
                                lastName: values.userForm.lastName,
                                password: values.userForm.password,
                                confirmPassword: values.userForm.confirmPassword,
                            },
                        } as IReviewForm;
                        tenantService.post(reviewForm).then((result: boolean) => {
                            if (result) {
                                this.props.handleNext();
                            }
                        });
                    }}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid classes={{ item: classes.gridItem }} item xs={12}>
                                    <Typography variant="h6">Domain</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        disabled
                                        name="domainForm.domain"
                                        label="Domain"
                                        value={props.initialValues.domainForm.domain}
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
                                        name="domainForm.organizationName"
                                        label="Organization name"
                                        value={props.initialValues.domainForm.organizationName}
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
                                <FormikBackButton onClick={this.props.handleBack} />
                                <FormikPrimaryButton denseMargin isValid={true} isSubmitting={props.isSubmitting} variant="contained" />
                            </div>
                        </form>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Review);
