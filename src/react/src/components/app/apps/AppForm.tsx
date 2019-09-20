import * as React from "react";
import IApp from "../../../models/app/IApp";
import AppService from "../../../services/AppService";
import { Formik, FormikProps, FormikBag, FormikErrors } from "formik";
import * as Yup from "yup";
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, CssBaseline, List, ListItemText, Typography, ListItem, TextField } from "@material-ui/core";
import { withSnackbar, WithSnackbarProps } from "notistack";
import FormikTextField from "../../form/FormikTextField";
import FormikCancelButton from "../../form/FormikCancelButton";
import { IRestResponse } from "../../../services/RestUtilities";
import { connect } from "react-redux";
import { ApplicationState } from "../../../stores/index";
import { push } from "connected-react-router";
import FormikDeleteButton from "../../../components/form/FormikDeleteButton";
import FormikSynchronousButton from "../../form/FormikSynchronousButton";
import { addApp, removeApp } from "../../../redux/actions/AppActions";
import RoutePaths from "../../RoutePaths";
import * as queryString from "query-string";

const appService = new AppService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: "auto",
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.toolbar.height,
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: "auto",
                marginRight: "auto",
            },
        },
        flexButtonContainer: {
            display: "flex",
        },
        leftButtons: {
            flexGrow: 1,
        },
    });
interface IAppFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    dispatchAddApp: (app: IApp) => void;
    dispatchRemoveApp: (name: string) => void;
    closeForm: () => void;
    apps?: IApp[];
    push: typeof push;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        dispatchAddApp: (app: IApp) => {
            const action = addApp(app);
            dispatch(action);
        },
        dispatchRemoveApp: (name: string) => {
            const action = removeApp(name);
            dispatch(action);
        },
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return { apps: state.apps };
};

type AppFormState = {
    serverErrors: string[];
    initialApp: IApp;
    isSuccess: boolean;
};

class AppForm extends React.Component<IAppFormProps, AppFormState> {
    state: AppFormState = {
        serverErrors: undefined,
        initialApp: undefined,
        isSuccess: false,
    };

    deleteApp(props: FormikProps<IApp>, enqueueSnackbar: any) {
        console.log("DELETE THE APPLICATION");
        setTimeout(() => {
            this.props.dispatchRemoveApp(props.values.name);
            enqueueSnackbar("Application deleted", { variant: "error" });
            this.props.push(RoutePaths.Apps);
        }, 250);
    }

    getAppByName = (apps: IApp[]) => {
        let result = undefined;
        const params = queryString.parse(window.location.search);
        const name = params["name"] as string;
        if (name && apps) {
            result = apps.find(a => a.name === name);
        }

        return result;
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
    });

    render() {
        const { classes, apps, enqueueSnackbar, dispatchAddApp } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={0}>
                        <Typography variant="h5" gutterBottom>
                            {this.getAppByName(apps) ? "Edit" : "Create"}
                        </Typography>

                        <Formik
                            enableReinitialize
                            initialValues={this.getAppByName(apps) ? this.getAppByName(apps) : { name: "", description: "", apiKey: "" }}
                            onSubmit={(values: IApp, formikBag: FormikBag<FormikProps<IApp>, IApp>) => {
                                console.log(values);
                                this.setState({ serverErrors: undefined });
                                const newApp = {
                                    name: values.name,
                                    description: values.description,
                                } as IApp;
                                appService.postApp(newApp).then((response: IRestResponse<IApp>) => {
                                    setTimeout(() => {
                                        if (response.is_error) {
                                            const { serverErrors, ...formikErrors } = response.error_content.errors;
                                            enqueueSnackbar("Error creating app", { variant: "error" });
                                            formikBag.setErrors(formikErrors as FormikErrors<IApp>);
                                            this.setState({ serverErrors: serverErrors });
                                            formikBag.setSubmitting(false);
                                        } else {
                                            this.setState({ isSuccess: true });
                                            enqueueSnackbar("App created", { variant: "success" });
                                            setTimeout(this.props.closeForm, 250);
                                            dispatchAddApp(response.content);
                                        }
                                    }, 2000);
                                });
                            }}
                            validationSchema={this.validationSchema}
                        >
                            {props => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid container spacing={3}>
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
                                                disabled={props.initialValues.name === "" ? false : true}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="description"
                                                label="Description"
                                                value={props.values.description}
                                                errorText={props.errors.description}
                                                touched={props.touched.description}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                            />
                                        </Grid>
                                        {props.values.apiKey && (
                                            <Grid item xs={12}>
                                                <TextField name="apiKey" label="Api Key" value={props.values.apiKey} fullWidth disabled />
                                            </Grid>
                                        )}
                                        {this.state.serverErrors && (
                                            <Grid item xs={12}>
                                                <List>
                                                    <ListItem>
                                                        {this.state.serverErrors.map(error => (
                                                            <ListItemText primary={error} />
                                                        ))}
                                                    </ListItem>
                                                </List>
                                            </Grid>
                                        )}
                                    </Grid>
                                    <div className={classes.flexButtonContainer}>
                                        <div className={classes.leftButtons}>
                                            <FormikDeleteButton
                                                isSubmitting={props.isSubmitting}
                                                onConfirm={() => {
                                                    this.deleteApp(props, enqueueSnackbar);
                                                }}
                                                dialogTitle="Delete app?"
                                                confirmText="Delete"
                                                dialogContent={"Are you sure you want to delete app " + props.values.name + "?"}
                                            >
                                                Delete
                                            </FormikDeleteButton>
                                        </div>
                                        <FormikCancelButton
                                            isSubmitting={props.isSubmitting}
                                            onClick={() => {
                                                this.props.push("/apps");
                                            }}
                                        />
                                        <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.isSuccess}>
                                            {props.initialValues.name === "" ? "Create" : "Update"}
                                        </FormikSynchronousButton>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </Paper>
                </main>
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(withSnackbar(AppForm)));
