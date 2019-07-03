import * as React from "react";
import { Formik, FormikProps, FormikBag } from "formik";
import FormikTextField from "../../../../form/FormikTextField";
import FormikCancelButton from "../../../../form/FormikCancelButton";
import FormikDeleteButton from "../../../../form/FormikDeleteButton";
import FormikCheckbox from "../../../../form/FormikCheckbox";
import CircularGeoFence from "../../../../../models/app/geofences/CircularGeoFence";
import { DialogContent, openDialog } from "../../../../../redux/actions/DialogActions";
import { Theme, createStyles, WithStyles, List, ListItem, ListItemText, withStyles, Grid, FormLabel } from "@material-ui/core";
import { CircularGeoFenceState } from "../../../../../redux/actions/GoogleMapsActions";
import { withSnackbar, WithSnackbarProps } from "notistack";
import * as Yup from "yup";
import { connect } from "react-redux";
import { addGeoFence, removeGeoFence } from "../../../../../redux/actions/GeoFenceActions";
import CoordinatePair from "../../../../../models/app/geofences/CoordinatePair";
import AutoCompleteMultiSelect from "../../../../form/AutoCompleteMultiSelect";
import FormikSynchronousButton from "../../../../form/FormikSynchronousButton";
import { push } from "connected-react-router";
import RoutePaths from "../../../../RoutePaths";

const styles = (theme: Theme) =>
    createStyles({
        form: {
            paddingTop: 0,
            paddingRight: theme.spacing.unit * 2,
            paddingBottom: 0,
            paddingLeft: theme.spacing.unit * 2,
        },
        flexButtons: {
            display: "flex",
        },
        leftButtons: {
            flexGrow: 1,
        },
    });

interface CircularGeoFenceFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    mapGeoFence: CircularGeoFenceState;
    editGeoFence?: CircularGeoFence;
    selectedApp: string;
    integrationNames: string[];
    closeDrawer: () => void;
    openDialog: (dialogCotent: DialogContent) => void;
    saveGeoFenceToState: (geofence: CircularGeoFence) => void;
    removeGeoFenceFromState: (name: string) => void;
    clearNewCircularGeoFence: () => void;
    enableMapClick: () => void;
    push: (path: string) => void;
}

interface CircularGeoFenceFormState {
    serverErrors: string[];
    selectedIntegrations: string[];
    isSuccess: boolean;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(
                new DialogContent(
                    dialogContent.title,
                    dialogContent.content,
                    dialogContent.confirmText,
                    dialogContent.confirmAction,
                    dialogContent.cancelAction
                )
            );
            dispatch(action);
        },
        saveGeoFenceToState: (geofence: CircularGeoFence) => {
            const action = addGeoFence(geofence);
            dispatch(action);
        },
        removeGeoFenceFromState: (name: string) => {
            const action = removeGeoFence(name);
            dispatch(action);
        },
        push: (path: string) => {
            dispatch(push(path));
        },
    };
};

class CircularGeoFenceDrawerContent extends React.Component<CircularGeoFenceFormProps, CircularGeoFenceFormState> {
    constructor(props: CircularGeoFenceFormProps) {
        super(props);
        if (this.props.editGeoFence) {
            this.state = { serverErrors: undefined, selectedIntegrations: this.props.editGeoFence.integrations, isSuccess: false };
        }
    }

    formikRef: React.RefObject<Formik> = React.createRef();

    state: CircularGeoFenceFormState = {
        serverErrors: undefined,
        selectedIntegrations: [],
        isSuccess: false,
    };

    cancelSaveGeoFence = (formikBag: FormikBag<FormikProps<CircularGeoFence>, CircularGeoFence>) => {
        formikBag.setSubmitting(false);
        this.props.enableMapClick();
    };

    saveGeoFence = (geoFence: CircularGeoFence) => {
        //save to server
        setTimeout(() => {
            this.setState({ isSuccess: true });
            this.props.saveGeoFenceToState(geoFence);
            this.props.clearNewCircularGeoFence();
            this.props.enqueueSnackbar("Geo-fence saved", { variant: "success" });
            this.props.enableMapClick();
            this.props.push("/" + window.location.pathname.split("/")[1] + "/geofences/map");
            this.props.closeDrawer();
        }, 500);
    };

    deleteGeoFence = (name: string) => {
        //delete from server
        setTimeout(() => {
            this.props.removeGeoFenceFromState(name);
            this.props.clearNewCircularGeoFence();
            this.props.enqueueSnackbar("Geo-fence deleted", { variant: "error" });
            this.props.enableMapClick();
            this.props.push("/" + window.location.pathname.split("/")[1] + "/geofences/map");
            this.props.closeDrawer();
        }, 500);
    };

    cancelGeoFenceEdit = () => {
        this.props.saveGeoFenceToState(this.props.editGeoFence);
        this.props.clearNewCircularGeoFence();
        this.props.enableMapClick();
        this.props.push("/" + window.location.pathname.split("/")[1] + "/geofences/map");
        this.props.closeDrawer();
    };

    cancelGeoFenceCreate = () => {
        this.props.clearNewCircularGeoFence();
        this.setState({ serverErrors: undefined });
        this.props.enableMapClick();
        this.props.push("/" + window.location.pathname.split("/")[1] + "/geofences/map");
        this.props.closeDrawer();
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required("Required"),
        description: Yup.string().notRequired(),
    });

    render() {
        const { classes } = this.props;
        return (
            <Formik
                ref={this.formikRef}
                enableReinitialize={false}
                initialValues={
                    this.props.editGeoFence
                        ? this.props.editGeoFence
                        : new CircularGeoFence(this.props.selectedApp, [], true, false, "", "", new CoordinatePair(0, 0), 0)
                }
                isInitialValid={this.props.editGeoFence ? true : false}
                onSubmit={(values: CircularGeoFence, formikBag: FormikBag<FormikProps<CircularGeoFence>, CircularGeoFence>) => {
                    const newFence = new CircularGeoFence(
                        this.props.selectedApp,
                        this.state.selectedIntegrations,
                        values.onEnter,
                        values.onExit,
                        values.name,
                        values.description,
                        new CoordinatePair(this.props.mapGeoFence.center.lat, this.props.mapGeoFence.center.lng),
                        this.props.mapGeoFence.radius
                    );

                    if (this.showNoIntegrationsWithTriggersDialog(newFence)) {
                        const content = new DialogContent(
                            "Save geo-fence with no integrations?",
                            "You can choose to save this geo-fence without integrations and still perform API requests to determine if a position is contained within the geo-fence. Triggers will have no effect.",
                            "Save geo-fence",
                            () => {
                                this.saveGeoFence(newFence);
                            },
                            () => {
                                this.cancelSaveGeoFence(formikBag);
                            }
                        );
                        this.props.openDialog(content);
                    } else if (this.showNoTriggersDialog(newFence)) {
                        const content = new DialogContent(
                            "Save geo-fence with no triggers?",
                            "You can choose to save this geo-fence without triggers and still perform API requests to determine if a position is contained within the geo-fence. Any selected integrations will not be triggered.",
                            "Save geo-fence",
                            () => {
                                this.saveGeoFence(newFence);
                            },
                            () => {
                                this.cancelSaveGeoFence(formikBag);
                            }
                        );
                        this.props.openDialog(content);
                    } else {
                        this.saveGeoFence(newFence);
                    }
                }}
                validationSchema={this.validationSchema}
            >
                {props => (
                    <form className={classes.form} onSubmit={props.handleSubmit}>
                        <Grid container direction="column" spacing={32}>
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
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <AutoCompleteMultiSelect
                                    suggestions={this.props.integrationNames}
                                    defaultValues={this.props.editGeoFence ? this.props.editGeoFence.integrations : undefined}
                                    onChange={(values: string[]) => this.setState({ selectedIntegrations: values })}
                                />
                            </Grid>
                            <Grid container item xs={12} spacing={0}>
                                <Grid item xs={12}>
                                    <FormLabel component="label">Trigger geo-fence on</FormLabel>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikCheckbox
                                        name="onEnter"
                                        label="Enter"
                                        value={props.values.onEnter}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormikCheckbox
                                        name="onExit"
                                        label="Exit"
                                        value={props.values.onExit}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </Grid>
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
                        <div className={classes.flexButtons}>
                            <div className={classes.leftButtons}>
                                {this.props.editGeoFence && (
                                    <FormikDeleteButton
                                        dialogTitle="Delete geo-fence?"
                                        dialogContent={"Are you sure you want to delete the geo-fence named " + props.values.name + "?"}
                                        confirmText="Delete geo-fence"
                                        onConfirm={() => {
                                            this.deleteGeoFence(props.values.name);
                                        }}
                                        isSubmitting={props.isSubmitting}
                                    />
                                )}
                            </div>

                            <FormikCancelButton
                                isSubmitting={props.isSubmitting}
                                onClick={() => {
                                    props.initialValues.name === "" ? this.cancelGeoFenceCreate() : this.cancelGeoFenceEdit();
                                }}
                            />
                            <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.isSuccess}>
                                {props.initialValues.name === "" ? "Create" : "Update"}{" "}
                            </FormikSynchronousButton>
                        </div>
                    </form>
                )}
            </Formik>
        );
    }

    private showNoTriggersDialog(newFence: CircularGeoFence) {
        return !newFence.onEnter && !newFence.onExit;
    }

    private showNoIntegrationsWithTriggersDialog(newFence: CircularGeoFence) {
        return newFence.integrations.length === 0 && (newFence.onEnter || newFence.onEnter);
    }
}

export default connect(
    null,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(withSnackbar(CircularGeoFenceDrawerContent)));
