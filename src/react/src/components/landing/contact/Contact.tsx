import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography } from '@material-ui/core';
import Footer from '../footer/Footer';
import { FormikBag, FormikProps, Formik } from 'formik';
import IContactForm from '../../../models/landing/IContactForm';
import FormikTextField from '../../form/FormikTextField';
import * as Yup from 'yup';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import { useState } from 'react';
import ContactService from '../../../services/ContactService';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        push: {
            paddingTop: '3%',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
    })
);

interface ContactProps {}

export default function Contact(props: ContactProps) {
    const classes = useStyles(props);
    const [isSuccess, setIsSuccess] = useState(false);
    const contactService = new ContactService();
    const [serverError, setServerError] = useState(undefined);

    const validationSchema = Yup.object().shape({
        message: Yup.string().required('Required'),
        organization: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
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
                <Grid container item justify="space-evenly" alignItems="center" spacing={3} xs={12} md={8}>
                    <Grid item xs={11} sm={8} md={5} lg={3}>
                        <React.Fragment>
                            <Formik
                                initialValues={{
                                    email: '',
                                    organization: '',
                                    message: '',
                                }}
                                onSubmit={(values: IContactForm, formikBag: FormikBag<FormikProps<IContactForm>, IContactForm>) => {
                                    setServerError(undefined);
                                    const contactForm = {
                                        email: values.email,
                                        organization: values.organization,
                                        message: values.message,
                                    } as IContactForm;
                                    contactService.postContactForm(contactForm).then((response) => {
                                        if (response.isError) {
                                            setServerError(response.error.message);
                                        } else {
                                            setIsSuccess(true);
                                        }
                                    });
                                }}
                                validationSchema={validationSchema}
                            >
                                {(props) => (
                                    <form onSubmit={props.handleSubmit}>
                                        <Grid container spacing={3}>
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
                                            {serverError && (
                                                <Grid item xs={12}>
                                                    <Typography color="error" variant="subtitle1">
                                                        {serverError}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                        <div className={classes.buttons}>
                                            <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={isSuccess} />
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </React.Fragment>
                    </Grid>
                </Grid>
            </Grid>
            <Footer />
        </React.Fragment>
    );
}
