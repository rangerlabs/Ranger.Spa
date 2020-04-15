import * as React from 'react';
import { Typography, createStyles, Theme, WithStyles, Button, withStyles, Grid } from '@material-ui/core';
import * as queryString from 'query-string';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import UserService from '../../../services/UserService';
import { Formik, FormikBag, FormikProps } from 'formik';
import * as Yup from 'yup';
import FormikTextField from '../../form/FormikTextField';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import IChangeEmailModel from '../../../models/landing/IChangeEmailModel';
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

interface EmailChangeProps extends WithStyles<typeof styles> {
    push: typeof push;
}

interface EmailChangeState {
    serverError: string;
    domain: string;
    success: boolean;
}

class EmailChange extends React.Component<EmailChangeProps, EmailChangeState> {
    validationSchema = Yup.object().shape({
        email: Yup.string().email('Must be a valid email.'),
    });

    state: EmailChangeState = {
        serverError: '',
        domain: '',
        success: false,
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
                                email: '',
                            } as IChangeEmailModel
                        }
                        onSubmit={(values: IChangeEmailModel, formikBag: FormikBag<FormikProps<IChangeEmailModel>, IChangeEmailModel>) => {
                            const userId = this.getUserIdFromParams();
                            userService.changeEmail(userId, values).then((v) => {
                                if (v.isError) {
                                    formikBag.setSubmitting(false);
                                    this.setState({ success: false, serverError: v.responseException.validationErrors[0].reason });
                                } else {
                                    setTimeout(() => {
                                        formikBag.setSubmitting(false);
                                        this.setState({ success: true });
                                    }, 350);
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
                                            Change Email
                                        </Typography>
                                        <Typography align="center" variant="subtitle1">
                                            To change your email, enter your current email.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            name="email"
                                            label="Current Email"
                                            value={props.values.email}
                                            errorText={props.errors.email}
                                            touched={props.touched.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                {this.state.serverError && (
                                    <Typography align="center" color="error">
                                        {this.state.serverError}
                                    </Typography>
                                )}
                                <div className={classes.flexButtonContainer}>
                                    <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.success}>
                                        Change Email
                                    </FormikSynchronousButton>
                                </div>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <Grid direction="column" container spacing={3} justify="center" alignItems="center">
                        <Grid item>
                            <Typography gutterBottom align="center" variant="h5">
                                Your email has been successfully changed.
                            </Typography>
                            <Typography gutterBottom align="center" variant="subtitle1">
                                Click below to sign in using your new email.
                            </Typography>
                        </Grid>
                        <Grid item>
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
                    </Grid>
                )}
            </div>
        );
    }
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(EmailChange));
