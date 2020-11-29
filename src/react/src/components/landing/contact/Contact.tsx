import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Paper } from '@material-ui/core';
import Footer from '../footer/Footer';
import { FormikBag, FormikProps, Formik } from 'formik';
import IContactForm from '../../../models/landing/IContactForm';
import FormikTextField from '../../form/FormikTextField';
import * as Yup from 'yup';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import { useState, useCallback } from 'react';
import ContactService from '../../../services/ContactService';
import FormikTextArea from '../../form/FormikTextArea';
import GetStartedForFree from '../getStartedForFree/GetStartedForFree';
import { GoogleReCaptcha, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        push: {
            paddingTop: '3%',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        paper: {
            padding: theme.spacing(4),
        },
    })
);

interface ContactProps {}

export default function Contact(props: ContactProps) {
    const classes = useStyles(props);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const contactService = new ContactService();
    const [serverError, setServerError] = useState(undefined);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const validationSchema = Yup.object().shape({
        organization: Yup.string().required('Required').max(512, 'Max 512 characters'),
        name: Yup.string().required('Required').max(512, 'Max 512 characters'),
        email: Yup.string().email('Invalid email').required('Required').max(512, 'Max 512 characters'),
        message: Yup.string().required('Required').max(1000, 'Max 1000 characters'),
    });

    return (
        <React.Fragment>
            <Grid className={classes.push} container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            Contact Us
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item justify="space-evenly" alignItems="center" spacing={3} xs={11} md={6}>
                    <React.Fragment>
                        <Formik
                            initialValues={{
                                email: '',
                                name: '',
                                organization: '',
                                message: '',
                                reCaptchaToken: '',
                            }}
                            onSubmit={(values: IContactForm, formikBag: FormikBag<FormikProps<IContactForm>, IContactForm>) => {
                                setIsSubmitting(true);
                                setServerError(undefined);
                                executeRecaptcha('contact_page')
                                    .then((token) => {
                                        const contactForm = {
                                            organization: values.organization,
                                            name: values.name,
                                            email: values.email,
                                            message: values.message,
                                            reCaptchaToken: token,
                                        } as IContactForm;
                                        contactService.postContactForm(contactForm).then((response) => {
                                            if (response.isError) {
                                                setServerError(response.error.message);
                                            } else {
                                                setIsSuccess(true);
                                            }
                                        });
                                        setIsSubmitting(false);
                                    })
                                    .catch(() => {
                                        setServerError('Failed to acquire reCaptcha token. Please try again.');
                                        setIsSubmitting(false);
                                    });
                            }}
                            validateOnMount={false}
                            isInitialValid={false}
                            validationSchema={validationSchema}
                        >
                            {(props) => (
                                <Paper className={classes.paper} elevation={3}>
                                    {isSuccess ? (
                                        <React.Fragment>
                                            <Typography align="center" variant="h5">
                                                Thank you.
                                            </Typography>
                                            <Typography align="center" variant="subtitle1">
                                                We have received your message and will be in contact as soon as possible.
                                            </Typography>
                                        </React.Fragment>
                                    ) : (
                                        <form onSubmit={props.handleSubmit}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <FormikTextField
                                                        name="organization"
                                                        label="Organization"
                                                        value={props.values.organization}
                                                        errorText={props.errors.organization}
                                                        touched={props.touched.organization}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        autoComplete="off"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormikTextField
                                                        name="name"
                                                        label="Name"
                                                        value={props.values.name}
                                                        errorText={props.errors.name}
                                                        touched={props.touched.name}
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
                                                    <FormikTextArea
                                                        name="message"
                                                        placeholder="How can we help?"
                                                        value={props.values.message}
                                                        errorText={props.errors.message}
                                                        touched={props.touched.message}
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
                                            <div className={classes.buttons}>
                                                <FormikSynchronousButton isValid={props.isValid} isSubmitting={isSubmitting} isSuccess={isSuccess}>
                                                    Send
                                                </FormikSynchronousButton>
                                            </div>
                                        </form>
                                    )}
                                </Paper>
                            )}
                        </Formik>
                    </React.Fragment>
                </Grid>
            </Grid>
            <GetStartedForFree />
            <Footer />
        </React.Fragment>
    );
}
