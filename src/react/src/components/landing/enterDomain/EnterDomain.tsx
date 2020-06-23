import * as React from 'react';
import { Theme, createStyles, Paper, withStyles, WithStyles, Grid, InputAdornment, Typography, Fade } from '@material-ui/core';
import * as Yup from 'yup';
import { Formik, FormikBag, FormikProps } from 'formik';
import FormikTextField from '../../form/FormikTextField';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import TenantService, { DomainEnabledResults } from '../../../services/TenantService';
import UserManager from '../../../services/UserManager';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import RoutePaths from '../../RoutePaths';
import { IRestResponse } from '../../../services/RestUtilities';
import GlobalConfig from '../../../helpers/GlobalConfig';

const tenantService = new TenantService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginTop: theme.toolbar.height * 2.5,
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(350 + theme.spacing(2 * 2))]: {
                width: 350,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        paper: {
            backgroundColor: theme.palette.common.white,
            padding: theme.spacing(4),
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
            .min(3, 'Must be at least 3 characters long')
            .max(28, 'Must be less than 28 characters long')
            .matches(
                new RegExp('^[a-zA-Z0-9]{1}[a-zA-Z0-9-]{1,26}[a-zA-Z0-9]{1}$'),
                'Must begin, end, and only contain alphanumeric characters, hyphens (-) are permitted '
            )
            .required('Required'),
    });

    render() {
        const { classes, enqueueSnackbar } = this.props;
        return (
            <React.Fragment>
                <div className={classes.layout}>
                    <Paper className={classes.paper} elevation={3}>
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
                                            setTimeout(() => {
                                                const loginPath = 'https://' + domain + '.' + GlobalConfig.SPA_HOST + RoutePaths.Login;
                                                window.location.href = loginPath;
                                            }, 350);
                                        } else {
                                            enqueueSnackbar('Could not find the requested domain', { variant: 'error' });
                                            formikBag.setSubmitting(false);
                                        }
                                    }
                                });
                            }}
                            validationSchema={this.validationSchema}
                        >
                            {(props) => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography align="center" variant="h5">
                                                Domain lookup
                                            </Typography>
                                        </Grid>
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
                                            />
                                        </Grid>
                                    </Grid>
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
                            )}
                        </Formik>
                    </Paper>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(withSnackbar(EnterDomain));
