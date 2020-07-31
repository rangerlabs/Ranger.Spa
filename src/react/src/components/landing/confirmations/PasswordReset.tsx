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
import GlobalConfig from '../../../helpers/GlobalConfig';
import RegularExpressions from '../../../helpers/RegularExpressions';
const userService = new UserService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            padding: theme.spacing(4),
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
    success: boolean;
    serverError: boolean;
}

class PasswordReset extends React.Component<PasswordResetProps, PasswordResetState> {
    validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .min(8, 'Min 8 characters')
            .max(64, 'Max 64 characters')
            .matches(new RegExp(RegularExpressions.PASSWORD_SPECIAL_CHARACTER), 'Must contain at least 1 special character')
            .matches(new RegExp(RegularExpressions.PASSWORD_NUMBER), 'Must contain at least 1 number')
            .matches(new RegExp(RegularExpressions.PASSWORD_LOWERCASE_LETTER), 'Must contain at least 1 lowercase letter')
            .matches(new RegExp(RegularExpressions.PASSWORD_UPPERCASE_LETTER), 'Must contain at least 1 uppercase letter')
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    state: PasswordResetState = {
        domain: '',
        success: false,
        serverError: false,
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
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.layout}>
                {!this.state.success ? (
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
                            userService.resetPassword(userId, values).then((v) => {
                                if (v.isError) {
                                    formikBag.setSubmitting(false);
                                    this.setState({ serverError: true });
                                } else {
                                    formikBag.setSubmitting(false);
                                    this.setState({ success: true });
                                }
                            });
                        }}
                        validateOnMount={false}
                        isInitialValid={false}
                        validationSchema={this.validationSchema}
                    >
                        {(props) => (
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
                                            required
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
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                {this.state.serverError && (
                                    <React.Fragment>
                                        <Typography align="center" color="error">
                                            An error occurred resetting your password.
                                        </Typography>
                                        <Typography align="center" color="error">
                                            The reset link may have expired.
                                        </Typography>
                                    </React.Fragment>
                                )}
                                <div className={classes.flexButtonContainer}>
                                    <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.success}>
                                        Reset Password
                                    </FormikSynchronousButton>
                                </div>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <Grid direction="column" container spacing={3} justify="center" alignItems="center">
                        <Grid item>
                            <Typography gutterBottom align="center" variant="h5">
                                Your password has been successfully changed.
                            </Typography>
                            <Typography gutterBottom align="center" variant="subtitle1">
                                Click below to sign in using your new password.
                            </Typography>
                        </Grid>
                        <Grid item>
                            <div className={classes.flexButtonContainer}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        this.state.domain
                                            ? window.location.assign(`https://${this.state.domain}.${GlobalConfig.SPA_HOST}${RoutePaths.Login}`)
                                            : this.props.push(RoutePaths.Landing);
                                    }}
                                >
                                    Sign in
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(PasswordReset));
