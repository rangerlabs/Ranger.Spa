import * as React from "react";
import { Theme, createStyles, Paper, withStyles, WithStyles, Grid, InputAdornment, Typography, Fade, IconButton } from "@material-ui/core";
import * as Yup from "yup";
import { Formik, FormikBag, FormikProps } from "formik";
import FormikTextField from "../../form/FormikTextField";
import FormikSynchronousButton from "../../form/FormikSynchronousButton";
import { withSnackbar, WithSnackbarProps } from "notistack";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: "auto",
            marginTop: theme.toolbar.height * 2.5,
            marginLeft: theme.spacing.unit * 2,
            marginRight: theme.spacing.unit * 2,
            [theme.breakpoints.up(400 + theme.spacing.unit * 2 * 2)]: {
                width: 400,
                marginLeft: "auto",
                marginRight: "auto",
            },
        },
        paper: {
            marginTop: theme.spacing.unit * 3,
            marginBottom: theme.spacing.unit * 3,
            padding: theme.spacing.unit * 2,
            [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
                marginTop: theme.spacing.unit * 6,
                marginBottom: theme.spacing.unit * 6,
                padding: theme.spacing.unit * 3,
            },
        },
        buttons: {
            display: "flex",
            justifyContent: "flex-end",
        },
    });

interface LoginProps extends WithStyles<typeof styles>, WithSnackbarProps {}
type LoginState = {
    passwordVisible: boolean;
    isSuccess: boolean;
};

type Login = {
    email: string;
    password: string;
};

class LoginPage extends React.Component<LoginProps, LoginState> {
    state = {
        passwordVisible: false,
        isSuccess: false,
    };
    validationSchema = Yup.object().shape({
        email: Yup.string()
            .email()
            .required("Required"),
        password: Yup.string()
            .min(8, "Must be at least 8 characters long")
            .matches(new RegExp("[!@#\\$%\\^\\&*\\)\\(+=._-]"), "Must contain at least 1 special character")
            .matches(new RegExp("[0-9]"), "Must contain at least 1 number")
            .matches(new RegExp("[a-z]"), "Must contain at least 1 lowercase letter")
            .matches(new RegExp("[A-Z]"), "Must contain at least 1 uppercase letter")
            .required("Required"),
    });
    handleClickShowPassword = () => {
        this.setState(prevState => ({
            passwordVisible: !prevState.passwordVisible,
        }));
    };

    render() {
        const { classes, enqueueSnackbar } = this.props;
        return (
            <React.Fragment>
                <div className={classes.layout}>
                    <Paper elevation={0} className={classes.paper}>
                        <Formik
                            initialValues={{ email: "", password: "" } as Login}
                            onSubmit={(values: Login, formikBag: FormikBag<FormikProps<Login>, Login>) => {
                                const email = values.email;
                                const password = values.password;
                                // tenantService.exists(domain).then(values => {
                                //     setTimeout(() => {
                                //         if (values.content) {
                                //             this.setState({ isSuccess: true });
                                //             enqueueSnackbar("Domain found", { variant: "success" });
                                //             setTimeout(() => {
                                //                 UserManager.signinRedirect({ acr_values: "tenant:" + domain, redirect_uri: redirectUri });
                                //             }, 1000);
                                //         } else {
                                //             enqueueSnackbar("Domain not found", { variant: "error" });
                                //             formikBag.setSubmitting(false);
                                //         }
                                //     }, 2000);
                                // });
                            }}
                            validationSchema={this.validationSchema}
                        >
                            {props => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12}>
                                            <Typography align="center" variant="h5">
                                                Login
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="email"
                                                label="Email"
                                                value={props.values.email}
                                                errorText={props.errors.email}
                                                touched={props.touched.email}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="domainPassword"
                                                label="Domain password"
                                                type={this.state.passwordVisible ? "text" : "password"}
                                                value={props.values.password}
                                                errorText={props.errors.password}
                                                touched={props.touched.password}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                                                                {this.state.passwordVisible ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
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
                                            Login
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

export default withStyles(styles)(withSnackbar(LoginPage));
