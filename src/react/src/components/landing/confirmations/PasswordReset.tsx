import * as React from 'react';
import { Typography, LinearProgress, createStyles, Theme, WithStyles, Button, withStyles, Grid } from '@material-ui/core';
import * as queryString from 'query-string';
import IPasswordResetModel from '../../../models/landing/IPasswordResetModel';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import UserService from '../../../services/UserService';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import FormikTextField from '../../form/FormikTextField';
import FormikBackButton from '../../form/FormikBackButton';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
const userService = new UserService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginTop: theme.toolbar.height * 2,
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(400 + theme.spacing(2 * 2))]: {
                width: 400,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        flexButtonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
    });

interface PasswordResetProps extends WithStyles<typeof styles> {
    push: typeof push;
}

interface PasswordResetState {
    domain: string;
    reset: boolean;
    isRequesting: boolean;
}

class PasswordReset extends React.Component<PasswordResetProps, PasswordResetState> {
    validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .min(8, 'Must be at least 8 characters long')
            .matches(new RegExp('[!@#\\$%\\^\\&*\\)\\(+=._-]'), 'Must contain at least 1 special character')
            .matches(new RegExp('[0-9]'), 'Must contain at least 1 number')
            .matches(new RegExp('[a-z]'), 'Must contain at least 1 lowercase letter')
            .matches(new RegExp('[A-Z]'), 'Must contain at least 1 uppercase letter')
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Required'),
    });

    state: PasswordResetState = {
        domain: '',
        reset: undefined,
        isRequesting: true,
    };

    getTokenFromParams(): string {
        const params = queryString.parse(window.location.search);
        const token = params['token'] as string;
        return token;
    }

    getUserIdFromParams(): string {
        const params = queryString.parse(window.location.search);
        const userId = params['userId'] as string;
        return userId;
    }

    getDomainFromParams(): string {
        const params = queryString.parse(window.location.search);
        const domain = params['domain'] as string;
        return domain;
    }

    componentDidMount() {
        const domain = this.getDomainFromParams();
        this.setState({ domain: domain });
        const token = this.getTokenFromParams();
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.layout}>
                <Formik
                    initialValues={
                        {
                            domain: this.getDomainFromParams(),
                            token: this.getTokenFromParams(),
                            newPassword: '',
                            confirmPassword: '',
                        } as IPasswordResetModel
                    }
                    onSubmit={(values: IPasswordResetModel, formikBag: FormikBag<FormikProps<IPasswordResetModel>, IPasswordResetModel>) => {
                        const userId = this.getUserIdFromParams();
                        userService
                            .resetPassword(userId, values)
                            .then(v => {
                                setTimeout(() => {
                                    this.setState({ reset: v, isRequesting: false });
                                }, 375);
                            })
                            .catch(r => {
                                this.setState({ isRequesting: false });
                            });
                    }}
                    validationSchema={this.validationSchema}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography align="center" variant="h5">
                                        Password Reset
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikTextField
                                        name="newPassword"
                                        label="New Password"
                                        value={props.values.newPassword}
                                        errorText={props.errors.newPassword}
                                        touched={props.touched.newPassword}
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
                            <div className={classes.flexButtonContainer}>
                                <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.reset}>
                                    Reset Password
                                </FormikSynchronousButton>
                            </div>
                        </form>
                    )}
                </Formik>
                {/* <Grid container direction="column" alignItems="center" spacing={3}>
                    {this.state.isRequesting && (
                        <Grid item xs={12}>
                            <Typography align="center" variant="h5">
                                Please wait while we confirm your domain.
                            </Typography>
                            <LinearProgress />
                        </Grid>
                    )}
                    {!this.state.isRequesting && this.state.reset && (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <Typography gutterBottom align="center" variant="h5">
                                    Your domain is confirmed.
                                </Typography>
                                <Typography gutterBottom align="center" variant="h5">
                                    Click below to get started.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        this.state.domain
                                            ? window.location.assign(`https://${this.state.domain}.${SPA_HOST}${RoutePaths.Login}`)
                                            : this.props.push(RoutePaths.Landing);
                                    }}
                                >
                                    Sign in
                                </Button>
                            </Grid>
                        </React.Fragment>
                    )}
                    {!this.state.isRequesting && !this.state.reset && (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <Typography align="center" variant="h5">
                                    Failed to reset your password.
                                </Typography>
                                <Typography align="center" variant="h5">
                                    The reset link may have expired or a property of the account may have been changed since the link was sent. Please request a
                                    new reset link.
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    )}
                </Grid> */}
            </div>
        );
    }
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(PasswordReset));
