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
    isRequesting: boolean;
}

class EmailChange extends React.Component<EmailChangeProps, EmailChangeState> {
    validationSchema = Yup.object().shape({
        email: Yup.string().email('Must be a valid email.'),
    });

    state: EmailChangeState = {
        serverError: '',
        domain: '',
        success: false,
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
                            userService.changeEmail(userId, values).then(v => {
                                if (v.is_error) {
                                    this.setState({ isRequesting: false, serverError: v.error_content.errors[0] });
                                } else {
                                    setTimeout(() => {
                                        this.setState({ success: true, isRequesting: false });
                                    }, 350);
                                }
                            });
                        }}
                        validationSchema={this.validationSchema}
                    >
                        {props => (
                            <form onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography align="center" variant="h5">
                                            Change Email
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            name="newPassword"
                                            label="New Password"
                                            value={props.values.email}
                                            errorText={props.errors.email}
                                            touched={props.touched.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            type="password"
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                {this.state.serverError && <Typography color="error">{this.state.serverError}</Typography>}
                                <div className={classes.flexButtonContainer}>
                                    <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.success}>
                                        Change Email
                                    </FormikSynchronousButton>
                                </div>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <Typography gutterBottom align="center" variant="h5">
                                Your email has been successfully changed.
                            </Typography>
                            <Typography gutterBottom align="center" variant="h5">
                                Click below to sign in using your new email.
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
            </div>
        );
    }
}

export default connect(null, { push })(withStyles(styles, { withTheme: true })(EmailChange));
