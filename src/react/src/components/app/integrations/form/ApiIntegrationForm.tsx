import * as React from "react";
import IntegrationService from "../../../../services/IntegrationService";
import { Formik, FormikProps, FormikBag, FormikErrors } from "formik";
import * as Yup from "yup";
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, CssBaseline, List, ListItemText, Typography, ListItem, TextField } from "@material-ui/core";
import { withSnackbar, WithSnackbarProps } from "notistack";
import FormikTextField from "../../../form/FormikTextField";
import FormikCancelButton from "../../../form/FormikCancelButton";
import { IRestResponse } from "../../../../services/RestUtilities";
import { connect } from "react-redux";
import { ApplicationState } from "../../../../stores/index";
import { push } from "connected-react-router";
import FormikDeleteButton from "../../../form/FormikDeleteButton";
import { MergedIntegrationType } from "../../../../models/app/integrations/MergedIntegrationType";
import ApiIntegration from "../../../../models/app/integrations/implementations/ApiIntegration";
import requireAppSelection from "../../hocs/RequireAppSelectionHOC";
import integrationForm from "./IntegrationFormHOC";
import RoutePaths from "../../../RoutePaths";
import { addIntegration, removeIntegration } from "../../../../redux/actions/IntegrationActions";
import FormikSynchronousButton from "../../../form/FormikSynchronousButton";

const integrationService = new IntegrationService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: "auto",
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
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
interface IApiIntegrationFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    dispatchAddIntegration: (integration: ApiIntegration) => void;
    dispatchRemoveIntegration: (name: string) => void;
    integrations?: MergedIntegrationType[];
    initialIntegration: ApiIntegration;
    selectedApp: string;
    push: typeof push;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        dispatchAddIntegration: (integration: ApiIntegration) => {
            const action = addIntegration(integration);
            dispatch(action);
        },
        dispatchRemoveIntegration: (name: string) => {
            const action = removeIntegration(name);
            dispatch(action);
        },
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return { integrations: state.integrations, selectedApp: state.selectedApp };
};

type ApiIntegrationFormState = {
    serverErrors: string[];
    isSuccess: boolean;
};

class ApiIntegrationForm extends React.Component<IApiIntegrationFormProps, ApiIntegrationFormState> {
    state: ApiIntegrationFormState = {
        serverErrors: undefined,
        isSuccess: false,
    };

    deleteIntegration(props: FormikProps<ApiIntegration | { name: string; description: string; httpEndpoint: string; authKey: string }>, enqueueSnackbar: any) {
        console.log("DELETE THE INTEGRATION");
        setTimeout(() => {
            this.props.dispatchRemoveIntegration(props.values.name);
            enqueueSnackbar("Integration deleted", { variant: "error" });
            this.props.push(RoutePaths.Integrations);
        }, 250);
    }

    validationSchema = Yup.object().shape({
        name: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
    });

    render() {
        const { classes, enqueueSnackbar, dispatchAddIntegration } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={0}>
                        <Typography variant="h5" gutterBottom>
                            {this.props.initialIntegration ? "Update" : "Create"}
                        </Typography>

                        <Formik
                            enableReinitialize
                            initialValues={
                                this.props.initialIntegration ? this.props.initialIntegration : { name: "", description: "", httpEndpoint: "", authKey: "" }
                            }
                            onSubmit={(values: ApiIntegration, formikBag: FormikBag<FormikProps<ApiIntegration>, ApiIntegration>) => {
                                console.log(values);
                                this.setState({ serverErrors: undefined });
                                const newIntegration = new ApiIntegration(
                                    this.props.selectedApp,
                                    values.name,
                                    values.description,
                                    values.httpEndpoint,
                                    values.authKey
                                );
                                integrationService.postApiIntegration(newIntegration).then((response: IRestResponse<ApiIntegration>) => {
                                    setTimeout(() => {
                                        if (response.is_error) {
                                            const { serverErrors, ...formikErrors } = response.error_content.errors;
                                            enqueueSnackbar("Error creating integration", { variant: "error" });
                                            formikBag.setErrors(formikErrors as FormikErrors<ApiIntegration>);
                                            this.setState({ serverErrors: serverErrors });
                                            formikBag.setSubmitting(false);
                                        } else {
                                            this.setState({ isSuccess: true });
                                            enqueueSnackbar("Integration created", { variant: "success" });
                                            dispatchAddIntegration(response.content);
                                            setTimeout(() => {
                                                this.props.push(RoutePaths.Integrations);
                                            }, 500);
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
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="httpEndpoint"
                                                label="HTTP Endpoing"
                                                value={props.values.httpEndpoint}
                                                errorText={props.errors.httpEndpoint}
                                                touched={props.touched.httpEndpoint}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormikTextField
                                                name="authKey"
                                                label="Basic Authorization Key"
                                                value={props.values.authKey}
                                                errorText={props.errors.authKey}
                                                touched={props.touched.authKey}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
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
                                                        this.deleteIntegration(props, enqueueSnackbar);
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
)(withStyles(styles)(withSnackbar(integrationForm(ApiIntegrationForm))));
