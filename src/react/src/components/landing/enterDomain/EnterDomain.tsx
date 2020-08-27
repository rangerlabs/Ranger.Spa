import * as React from 'react';
import { Theme, createStyles, Paper, withStyles, WithStyles, Grid, InputAdornment, Typography, Fade } from '@material-ui/core';
import * as Yup from 'yup';
import { Formik, FormikBag, FormikProps } from 'formik';
import FormikTextField from '../../form/FormikTextField';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import TenantService from '../../../services/TenantService';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import RoutePaths from '../../RoutePaths';
import { IRestResponse } from '../../../services/RestUtilities';
import GlobalConfig from '../../../helpers/GlobalConfig';
import RegularExpressions from '../../../helpers/RegularExpressions';
import Footer from '../footer/Footer';

const tenantService = new TenantService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            paddingTop: '3%',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(450 + theme.spacing(2 * 2))]: {
                width: 450,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        paper: {
            padding: theme.spacing(4),
        },
        title: {
            margin: theme.spacing(5),
        },
    });

interface EnterDomainProps extends WithStyles<typeof styles>, WithSnackbarProps {}
type EnterDomainState = {
    isSuccess: boolean;
};

type Domain = {
    domain: string;
};

class EnterDomain extends React.Component<EnterDomainProps, EnterDomainState> {
    state = {
        isSuccess: false,
    };

    validationSchema = Yup.object().shape({
        domain: Yup.string()
            .min(3, 'Min 3 characters')
            .max(28, 'Max 28 characters')
            .matches(new RegExp(RegularExpressions.ORGANIZATION_DOMAIN), 'Must begin, end, and contain alphanumeric characters. May contain ( - ).')
            .required('Required'),
    });

    render() {
        const { classes, enqueueSnackbar } = this.props;
        return (
            <Formik
                initialValues={{ domain: '' } as Domain}
                onSubmit={(values: Domain, formikBag: FormikBag<FormikProps<Domain>, Domain>) => {
                    const domain = values.domain;
                    tenantService.confirmed(domain).then((v: IRestResponse<boolean>) => {
                        if (v.isError) {
                            enqueueSnackbar('Could not find the requested domain', { variant: 'error' });
                            formikBag.setSubmitting(false);
                        } else {
                            if (v.result) {
                                this.setState({ isSuccess: true });
                                enqueueSnackbar('The domain was successfully found', { variant: 'success' });
                                const loginPath = 'https://' + domain + '.' + GlobalConfig.SPA_HOST + RoutePaths.Login;
                                window.location.href = loginPath;
                            } else {
                                enqueueSnackbar('Could not find the requested domain', { variant: 'error' });
                                formikBag.setSubmitting(false);
                            }
                        }
                    });
                }}
                validateOnMount={false}
                isInitialValid={false}
                validationSchema={this.validationSchema}
            >
                {(props) => (
                    <div className={classes.layout}>
                        <Typography className={classes.title} align="center" variant="h4">
                            Domain Lookup
                        </Typography>
                        <Paper className={classes.paper} elevation={3}>
                            <form onSubmit={props.handleSubmit}>
                                <FormikTextField
                                    name="domain"
                                    label="Domain"
                                    value={props.values.domain}
                                    errorText={props.errors.domain}
                                    touched={props.touched.domain}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    InputProps={{ endAdornment: <InputAdornment position="end">.rangerlabs.io</InputAdornment> }}
                                />
                                <div className={classes.buttons}>
                                    <FormikSynchronousButton
                                        isValid={props.isValid}
                                        isSubmitting={props.isSubmitting}
                                        isSuccess={this.state.isSuccess}
                                        type="submit"
                                    >
                                        Lookup Domain
                                    </FormikSynchronousButton>
                                </div>
                            </form>
                        </Paper>
                    </div>
                )}
            </Formik>
        );
    }
}

export default withStyles(styles)(withSnackbar(EnterDomain));
