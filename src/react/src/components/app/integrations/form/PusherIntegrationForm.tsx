import * as React from "react";
import IntegrationService from "../../../../services/IntegrationService";
import { Formik, FormikProps, FormikBag, FormikErrors } from "formik";
import * as Yup from "yup";
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, CssBaseline, List, ListItemText, Typography, ListItem, TextField } from "@material-ui/core";
import { withSnackbar, WithSnackbarProps } from "notistack";
import FormikTextField from "../../../form/FormikTextField";
import FormikPrimaryButton from "../../../form/FormikPrimaryButton";
import FormikUpdateButton from "../../../form/FormikUpdateButton";
import FormikCancelButton from "../../../form/FormikCancelButton";
import { IRestResponse } from "../../../../services/RestUtilities";
import { connect } from "react-redux";
import { ApplicationState } from "../../../../stores/index";
import { push } from "connected-react-router";
import FormikDeleteButton from "../../../form/FormikDeleteButton";
import { MergedIntegrationType } from "../../../../models/app/integrations/MergedIntegrationType";
import PusherIntegration from "../../../../models/app/integrations/implementations/PusherIntegration";
import requireAppSelection from "../../hocs/RequireAppSelectionHOC";
import integrationForm from "./IntegrationFormHOC";
import RoutePaths from "../../../RoutePaths";

const integrationService = new IntegrationService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: "auto",
            marginLeft: theme.spacing.unit * 2,
            marginRight: theme.spacing.unit * 2,
            [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
                width: 600,
                marginLeft: "auto",
                marginRight: "auto",
            },
        },
        paper: {
            marginTop: theme.spacing.unit * 3,
            marginBottom: theme.spacing.unit * 3,
            padding: theme.spacing.unit * 2,
            [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
                marginTop: theme.spacing.unit * 6,
                marginBottom: theme.spacing.unit * 6,
                padding: theme.spacing.unit * 3,
            },
        },
        flexButtonContainer: {
            display: "flex",
        },
        leftButtons: {
            flexGrow: 1,
        },
    });
interface IPusherIntegrationFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    dispatchAddIntegration: (integration: PusherIntegration) => void;
    closeForm: () => void;
    integrations?: MergedIntegrationType[];
    initialIntegration: PusherIntegration;
    selectedApp: string;
    push: typeof push;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return { integrations: state.integrations, selectedApp: state.selectedApp };
};

type PusherIntegrationFormState = {
    serverErrors: string[];
};

class PusherIntegrationForm extends React.Component<IPusherIntegrationFormProps, PusherIntegrationFormState> {
    state = {
        serverErrors: undefined as string[],
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        appId: Yup.string().required("Required"),
        key: Yup.string().required("Required"),
        secret: Yup.string().required("Required"),
        clusterName: Yup.string().required("Required"),
        channelName: Yup.string().required("Required"),
        eventName: Yup.string().required("Required"),
        payload: Yup.string().required("Required"),
    });

    render() {
        const { classes, enqueueSnackbar, dispatchAddIntegration } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography variant="h5" gutterBottom>
                            {this.props.initialIntegration ? "Update" : "Create"}
                        </Typography>

                        <Formik
                            enableReinitialize
                            initialValues={
                                this.props.initialIntegration
                                    ? this.props.initialIntegration
                                    : {
                                          name: "",
                                          description: "",
                                          appId: "",
                                          key: "",
                                          secret: "",
                                          clusterName: "",
                                          channelName: "",
                                          eventName: "",
                                          payload: "",
                                      }
                            }
                            onSubmit={(values: PusherIntegration, formikBag: FormikBag<FormikProps<PusherIntegration>, PusherIntegration>) => {
                                console.log(values);
                                this.setState({ serverErrors: undefined });
                                const newIntegration = new PusherIntegration(
                                    this.props.selectedApp,
                                    values.name,
                                    values.description,
                                    values.appId,
                                    values.key,
                                    values.secret,
                                    values.clusterName,
                                    values.channelName,
                                    values.eventName,
                                    values.payload
                                );
                                integrationService.postPusherIntegration(newIntegration).then((response: IRestResponse<PusherIntegration>) => {
                                    setTimeout(() => {
                                        if (response.is_error) {
                                            const { serverErrors, ...formikErrors } = response.error_content.errors;
                                            enqueueSnackbar("Error creating integration", { variant: "error" });
                                            formikBag.setErrors(formikErrors as FormikErrors<PusherIntegration>);
                                            this.setState({ serverErrors: serverErrors });
                                            formikBag.setSubmitting(false);
                                        } else {
                                            enqueueSnackbar("Integration created", { variant: "success" });
                                            setTimeout(this.props.closeForm, 500);
                                            dispatchAddIntegration(response.content);
                                        }
                                    }, 2000);
                                });
                            }}
                            validationSchema={this.validationSchema}
                        >
                            {props => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid container spacing={24}>
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
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="appId"
                                                label="Pusher App Id"
                                                value={props.values.appId}
                                                errorText={props.errors.appId}
                                                touched={props.touched.appId}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="key"
                                                label="Pusher Key"
                                                value={props.values.key}
                                                errorText={props.errors.key}
                                                touched={props.touched.key}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="secret"
                                                label="Pusher Secret"
                                                value={props.values.secret}
                                                errorText={props.errors.secret}
                                                touched={props.touched.secret}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="cluserName"
                                                label="Pusher Cluster Name"
                                                value={props.values.clusterName}
                                                errorText={props.errors.clusterName}
                                                touched={props.touched.clusterName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="channelName"
                                                label="Pusher Channel Name"
                                                value={props.values.channelName}
                                                errorText={props.errors.channelName}
                                                touched={props.touched.channelName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="eventName"
                                                label="Pusher Event Name"
                                                value={props.values.eventName}
                                                errorText={props.errors.eventName}
                                                touched={props.touched.eventName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="payload"
                                                label="Pusher Event Payload"
                                                value={props.values.payload}
                                                errorText={props.errors.payload}
                                                touched={props.touched.payload}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                                multiline
                                            />
                                        </Grid>
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
                                            {this.props.initialIntegration && (
                                                <FormikDeleteButton
                                                    isSubmitting={props.isSubmitting}
                                                    onConfirm={() => {
                                                        console.log("DELETE THE INTEGRATION");
                                                    }}
                                                    dialogTitle="Delete integration?"
                                                    confirmText="Delete"
                                                    dialogContent={"Are you sure you want to delete integration " + props.values.name + "?"}
                                                >
                                                    Delete
                                                </FormikDeleteButton>
                                            )}
                                        </div>
                                        <FormikCancelButton
                                            isSubmitting={props.isSubmitting}
                                            onClick={() => {
                                                this.props.push(RoutePaths.Integrations);
                                            }}
                                        />
                                        {props.initialValues.name === "" ? (
                                            <FormikPrimaryButton isValid={props.isValid} isSubmitting={props.isSubmitting} variant="contained" />
                                        ) : (
                                            <FormikUpdateButton isValid={props.isValid} isSubmitting={props.isSubmitting} />
                                        )}
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
)(withStyles(styles)(withSnackbar(integrationForm(PusherIntegrationForm))));
