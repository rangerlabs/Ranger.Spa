import * as React from "react";
import { Theme, createStyles, Paper, withStyles, WithStyles, Grid, InputAdornment, Typography, Fade } from "@material-ui/core";
import * as Yup from "yup";
import { Formik, FormikBag, FormikProps } from "formik";
import FormikTextField from "../../form/FormikTextField";
import FormikSynchronousButton from "../../form/FormikSynchronousButton";
import TenantService from "../../../services/TenantService";
import UserManager from "../../../services/UserManager";
import { withSnackbar, WithSnackbarProps } from "notistack";
import RoutePaths from "../../RoutePaths";

const tenantService = new TenantService();

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
            .min(3, "Must be at least 3 characters long")
            .max(28, "Must be less than 28 characters long")
            .matches(
                new RegExp("^[a-zA-Z0-9]{1}[a-zA-Z0-9-]{1,26}[a-zA-Z0-9]{1}$"),
                "Must begin, end, and only contain alphanumeric characters, hyphens (-) are permitted "
            )
            .required("Required"),
    });

    render() {
        const { classes, enqueueSnackbar } = this.props;
        return (
            <React.Fragment>
                <div className={classes.layout}>
                    <Paper elevation={0} className={classes.paper}>
                        <Formik
                            initialValues={{ domain: "" } as Domain}
                            onSubmit={(values: Domain, formikBag: FormikBag<FormikProps<Domain>, Domain>) => {
                                const domain = values.domain;
                                tenantService.exists(domain).then(v => {
                                    setTimeout(() => {
                                        if (v) {
                                            this.setState({ isSuccess: true });
                                            enqueueSnackbar("Domain found", { variant: "success" });
                                            setTimeout(() => {
                                                const loginPath = "http://" + domain + "." + SPA_HOST + BASE_PATH + RoutePaths.Login;
                                                window.location.href = loginPath;
                                            }, 750);
                                        } else {
                                            enqueueSnackbar("Domain not found", { variant: "error" });
                                            formikBag.setSubmitting(false);
                                        }
                                    }, 1250);
                                });
                            }}
                            validationSchema={this.validationSchema}
                        >
                            {props => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid container spacing={24}>
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
                                            Lookup
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
