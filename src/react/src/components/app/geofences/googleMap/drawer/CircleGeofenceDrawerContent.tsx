import * as React from 'react';
import { Formik, FormikProps, FormikBag } from 'formik';
import FormikTextField from '../../../../form/FormikTextField';
import FormikCancelButton from '../../../../form/FormikCancelButton';
import FormikDeleteButton from '../../../../form/FormikDeleteButton';
import FormikCheckbox from '../../../../form/FormikCheckbox';
import CircleGeofence from '../../../../../models/app/geofences/CircleGeofence';
import CircleGeofenceRequest from '../../../../../models/app/geofences/CircleGeofenceRequest';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { Theme, createStyles, WithStyles, List, ListItem, ListItemText, withStyles, Grid, FormLabel } from '@material-ui/core';
import { CircleGeofenceState } from '../../../../../redux/actions/GoogleMapsActions';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { addGeofence, removeGeofence } from '../../../../../redux/actions/GeofenceActions';
import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import AutoCompleteMultiSelect from '../../../../form/AutoCompleteMultiSelect';
import FormikSynchronousButton from '../../../../form/FormikSynchronousButton';
import { push } from 'connected-react-router';
import IProject from '../../../../../models/app/IProject';

const styles = (theme: Theme) =>
    createStyles({
        form: {
            paddingTop: 0,
            paddingRight: theme.spacing(2),
            paddingBottom: 0,
            paddingLeft: theme.spacing(2),
        },
        flexButtons: {
            display: 'flex',
        },
        leftButtons: {
            flexGrow: 1,
        },
        width100TemporaryChromiumFix: {
            width: '100%',
        },
    });

interface CircleGeofenceFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    mapGeofence: CircleGeofenceState;
    editGeofence?: CircleGeofence;
    selectedProject: IProject;
    integrationNames: string[];
    closeDrawer: () => void;
    openDialog: (dialogCotent: DialogContent) => void;
    saveGeofenceToState: (geofence: CircleGeofence) => void;
    removeGeofenceFromState: (name: string) => void;
    clearNewCircleGeofence: () => void;
    enableMapClick: () => void;
    push: (path: string) => void;
}

interface CircleGeofenceFormState {
    serverErrors: string[];
    selectedIntegrations: string[];
    isSuccess: boolean;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(
                new DialogContent(
                    dialogContent.content,
                    dialogContent.title,
                    dialogContent.confirmText,
                    dialogContent.confirmAction,
                    dialogContent.cancelAction
                )
            );
            dispatch(action);
        },
        saveGeofenceToState: (geofence: CircleGeofence) => {
            const action = addGeofence(geofence);
            dispatch(action);
        },
        removeGeofenceFromState: (name: string) => {
            const action = removeGeofence(name);
            dispatch(action);
        },
        push: (path: string) => {
            dispatch(push(path));
        },
    };
};

class CircleGeofenceDrawerContent extends React.Component<CircleGeofenceFormProps, CircleGeofenceFormState> {
    constructor(props: CircleGeofenceFormProps) {
        super(props);
        if (this.props.editGeofence) {
            this.state = { serverErrors: undefined, selectedIntegrations: this.props.editGeofence.integrationNames, isSuccess: false };
        }
    }

    formikRef: React.RefObject<Formik> = React.createRef();

    state: CircleGeofenceFormState = {
        serverErrors: undefined,
        selectedIntegrations: [],
        isSuccess: false,
    };

    cancelSaveGeofence = (formikBag: FormikBag<FormikProps<CircleGeofence>, CircleGeofence>) => {
        formikBag.setSubmitting(false);
        this.props.enableMapClick();
    };

    saveGeofence = (geofence: CircleGeofenceRequest) => {
        //save to server
        setTimeout(() => {
            this.setState({ isSuccess: true });
            const geofenceResponse = new CircleGeofence(
                this.props.selectedProject.name,
                geofence.name,
                geofence.labels,
                geofence.onEnter,
                geofence.onExit,
                geofence.enabled,
                geofence.description,
                geofence.integrationNames,
                geofence.coordinates,
                geofence.metadata,
                geofence.radius
            );
            this.props.saveGeofenceToState(geofenceResponse);
            this.props.clearNewCircleGeofence();
            this.props.enqueueSnackbar('Geofence saved', { variant: 'success' });
            this.props.enableMapClick();
            this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
            this.props.closeDrawer();
        }, 500);
    };

    deleteGeofence = (name: string) => {
        //delete from server
        setTimeout(() => {
            this.props.removeGeofenceFromState(name);
            this.props.clearNewCircleGeofence();
            this.props.enqueueSnackbar('Geofence deleted', { variant: 'error' });
            this.props.enableMapClick();
            this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
            this.props.closeDrawer();
        }, 500);
    };

    cancelGeofenceEdit = () => {
        this.props.saveGeofenceToState(this.props.editGeofence);
        this.props.clearNewCircleGeofence();
        this.props.enableMapClick();
        this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
        this.props.closeDrawer();
    };

    cancelGeofenceCreate = () => {
        this.props.clearNewCircleGeofence();
        this.setState({ serverErrors: undefined });
        this.props.enableMapClick();
        this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
        this.props.closeDrawer();
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        description: Yup.string().notRequired(),
    });

    render() {
        const { classes } = this.props;
        return (
            <Formik
                ref={this.formikRef}
                enableReinitialize={false}
                initialValues={
                    this.props.editGeofence
                        ? this.props.editGeofence
                        : new CircleGeofenceRequest('', [], true, true, true, '', [], [new CoordinatePair(0, 0)], new Map<string, object>(), 0)
                }
                isInitialValid={this.props.editGeofence ? true : false}
                onSubmit={(values: CircleGeofence, formikBag: FormikBag<FormikProps<CircleGeofence>, CircleGeofence>) => {
                    const newFence = new CircleGeofenceRequest(
                        values.name,
                        values.labels,
                        values.onEnter,
                        values.onExit,
                        values.enabled,
                        values.description,
                        this.state.selectedIntegrations,
                        [new CoordinatePair(this.props.mapGeofence.center.lat, this.props.mapGeofence.center.lng)],
                        new Map<string, object>(),
                        this.props.mapGeofence.radius
                    );

                    if (this.showNoIntegrationsWithTriggersDialog(newFence)) {
                        const content = new DialogContent(
                            'You can choose to save this geofence without integrations and still perform API requests to determine if a position is contained within the geofence. Triggers will have no effect.',
                            'Save geofence with no integrations?',
                            'Save geofence',
                            () => {
                                this.saveGeofence(newFence);
                            },
                            () => {
                                this.cancelSaveGeofence(formikBag);
                            }
                        );
                        this.props.openDialog(content);
                    } else if (this.showNoTriggersDialog(newFence)) {
                        const content = new DialogContent(
                            'You can choose to save this geofence without triggers and still perform API requests to determine if a position is contained within the geofence. Any selected integrations will not be triggered.',
                            'Save geofence with no triggers?',
                            'Save geofence',
                            () => {
                                this.saveGeofence(newFence);
                            },
                            () => {
                                this.cancelSaveGeofence(formikBag);
                            }
                        );
                        this.props.openDialog(content);
                    } else {
                        this.saveGeofence(newFence);
                    }
                }}
                validationSchema={this.validationSchema}
            >
                {props => (
                    <form className={classes.form} onSubmit={props.handleSubmit}>
                        <Grid container direction="column" spacing={4}>
                            <Grid container item xs={12} spacing={0}>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                    <FormikCheckbox
                                        name="enabled"
                                        label="Enabled"
                                        value={props.values.enabled}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </Grid>
                            </Grid>
                            <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                <FormikTextField
                                    name="name"
                                    label="Name"
                                    value={props.values.name}
                                    errorText={props.errors.name}
                                    touched={props.touched.name}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                    required
                                />
                            </Grid>
                            <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
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
                            <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                <AutoCompleteMultiSelect
                                    suggestions={this.props.integrationNames}
                                    defaultValues={this.props.editGeofence ? this.props.editGeofence.integrationNames : undefined}
                                    onChange={(values: string[]) => this.setState({ selectedIntegrations: values })}
                                />
                            </Grid>
                            <Grid container item xs={12} spacing={0}>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                    <FormLabel component="label">Trigger geofence on</FormLabel>
                                </Grid>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                    <FormikCheckbox
                                        name="onEnter"
                                        label="Enter"
                                        value={props.values.onEnter}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </Grid>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
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
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
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
                                {this.props.editGeofence && (
                                    <FormikDeleteButton
                                        dialogTitle="Delete geofence?"
                                        dialogContent={'Are you sure you want to delete the geofence named ' + props.values.name + '?'}
                                        confirmText="Delete geofence"
                                        onConfirm={() => {
                                            this.deleteGeofence(props.values.name);
                                        }}
                                        isSubmitting={props.isSubmitting}
                                    />
                                )}
                            </div>

                            <FormikCancelButton
                                isSubmitting={props.isSubmitting}
                                onClick={() => {
                                    props.initialValues.name === '' ? this.cancelGeofenceCreate() : this.cancelGeofenceEdit();
                                }}
                            />
                            <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.isSuccess}>
                                {props.initialValues.name === '' ? 'Create' : 'Update'}
                            </FormikSynchronousButton>
                        </div>
                    </form>
                )}
            </Formik>
        );
    }

    private showNoTriggersDialog(newFence: CircleGeofenceRequest) {
        return !newFence.onEnter && !newFence.onExit;
    }

    private showNoIntegrationsWithTriggersDialog(newFence: CircleGeofenceRequest) {
        return newFence.integrationNames.length === 0 && (newFence.onEnter || newFence.onEnter);
    }
}

export default connect(
    null,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(withSnackbar(CircleGeofenceDrawerContent)));
