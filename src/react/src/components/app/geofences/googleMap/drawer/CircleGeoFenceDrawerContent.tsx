import * as React from 'react';
import { Formik, FormikProps, FormikBag } from 'formik';
import FormikTextField from '../../../../form/FormikTextField';
import FormikCancelButton from '../../../../form/FormikCancelButton';
import FormikDeleteButton from '../../../../form/FormikDeleteButton';
import FormikCheckbox from '../../../../form/FormikCheckbox';
import CircleGeoFence from '../../../../../models/app/geofences/CircleGeoFence';
import CircleGeoFenceRequest from '../../../../../models/app/geofences/CircleGeoFenceRequest';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { Theme, createStyles, WithStyles, List, ListItem, ListItemText, withStyles, Grid, FormLabel } from '@material-ui/core';
import { CircleGeoFenceState } from '../../../../../redux/actions/GoogleMapsActions';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { addGeoFence, removeGeoFence } from '../../../../../redux/actions/GeoFenceActions';
import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import AutoCompleteMultiSelect from '../../../../form/AutoCompleteMultiSelect';
import FormikSynchronousButton from '../../../../form/FormikSynchronousButton';
import { push } from 'connected-react-router';
import RoutePaths from '../../../../RoutePaths';
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

interface CircleGeoFenceFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    mapGeoFence: CircleGeoFenceState;
    editGeoFence?: CircleGeoFence;
    selectedProject: IProject;
    integrationNames: string[];
    closeDrawer: () => void;
    openDialog: (dialogCotent: DialogContent) => void;
    saveGeoFenceToState: (geofence: CircleGeoFence) => void;
    removeGeoFenceFromState: (name: string) => void;
    clearNewCircleGeoFence: () => void;
    enableMapClick: () => void;
    push: (path: string) => void;
}

interface CircleGeoFenceFormState {
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
        saveGeoFenceToState: (geofence: CircleGeoFence) => {
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

class CircleGeoFenceDrawerContent extends React.Component<CircleGeoFenceFormProps, CircleGeoFenceFormState> {
    constructor(props: CircleGeoFenceFormProps) {
        super(props);
        if (this.props.editGeoFence) {
            this.state = { serverErrors: undefined, selectedIntegrations: this.props.editGeoFence.integrationNames, isSuccess: false };
        }
    }

    formikRef: React.RefObject<Formik> = React.createRef();

    state: CircleGeoFenceFormState = {
        serverErrors: undefined,
        selectedIntegrations: [],
        isSuccess: false,
    };

    cancelSaveGeoFence = (formikBag: FormikBag<FormikProps<CircleGeoFence>, CircleGeoFence>) => {
        formikBag.setSubmitting(false);
        this.props.enableMapClick();
    };

    saveGeoFence = (geoFence: CircleGeoFenceRequest) => {
        //save to server
        setTimeout(() => {
            this.setState({ isSuccess: true });
            const geoFenceResponse = new CircleGeoFence(
                this.props.selectedProject.name,
                geoFence.name,
                geoFence.labels,
                geoFence.onEnter,
                geoFence.onExit,
                geoFence.enabled,
                geoFence.description,
                geoFence.integrationNames,
                geoFence.coordinates,
                geoFence.metadata,
                geoFence.radius
            );
            this.props.saveGeoFenceToState(geoFenceResponse);
            this.props.clearNewCircleGeoFence();
            this.props.enqueueSnackbar('Geofence saved', { variant: 'success' });
            this.props.enableMapClick();
            this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
            this.props.closeDrawer();
        }, 500);
    };

    deleteGeoFence = (name: string) => {
        //delete from server
        setTimeout(() => {
            this.props.removeGeoFenceFromState(name);
            this.props.clearNewCircleGeoFence();
            this.props.enqueueSnackbar('Geofence deleted', { variant: 'error' });
            this.props.enableMapClick();
            this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
            this.props.closeDrawer();
        }, 500);
    };

    cancelGeoFenceEdit = () => {
        this.props.saveGeoFenceToState(this.props.editGeoFence);
        this.props.clearNewCircleGeoFence();
        this.props.enableMapClick();
        this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
        this.props.closeDrawer();
    };

    cancelGeoFenceCreate = () => {
        this.props.clearNewCircleGeoFence();
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
                    this.props.editGeoFence
                        ? this.props.editGeoFence
                        : new CircleGeoFenceRequest('', [], true, true, true, '', [], [new CoordinatePair(0, 0)], new Map<string, object>(), 0)
                }
                isInitialValid={this.props.editGeoFence ? true : false}
                onSubmit={(values: CircleGeoFence, formikBag: FormikBag<FormikProps<CircleGeoFence>, CircleGeoFence>) => {
                    const newFence = new CircleGeoFenceRequest(
                        values.name,
                        values.labels,
                        values.onEnter,
                        values.onExit,
                        values.enabled,
                        values.description,
                        this.state.selectedIntegrations,
                        [new CoordinatePair(this.props.mapGeoFence.center.lat, this.props.mapGeoFence.center.lng)],
                        new Map<string, object>(),
                        this.props.mapGeoFence.radius
                    );

                    if (this.showNoIntegrationsWithTriggersDialog(newFence)) {
                        const content = new DialogContent(
                            'Save geofence with no integrations?',
                            'You can choose to save this geofence without integrations and still perform API requests to determine if a position is contained within the geofence. Triggers will have no effect.',
                            'Save geofence',
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
                            'Save geofence with no triggers?',
                            'You can choose to save this geofence without triggers and still perform API requests to determine if a position is contained within the geofence. Any selected integrations will not be triggered.',
                            'Save geofence',
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
                                    defaultValues={this.props.editGeoFence ? this.props.editGeoFence.integrationNames : undefined}
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
                                {this.props.editGeoFence && (
                                    <FormikDeleteButton
                                        dialogTitle="Delete geofence?"
                                        dialogContent={'Are you sure you want to delete the geofence named ' + props.values.name + '?'}
                                        confirmText="Delete geofence"
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
                                    props.initialValues.name === '' ? this.cancelGeoFenceCreate() : this.cancelGeoFenceEdit();
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

    private showNoTriggersDialog(newFence: CircleGeoFenceRequest) {
        return !newFence.onEnter && !newFence.onExit;
    }

    private showNoIntegrationsWithTriggersDialog(newFence: CircleGeoFenceRequest) {
        return newFence.integrationNames.length === 0 && (newFence.onEnter || newFence.onEnter);
    }
}

export default connect(
    null,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(withSnackbar(CircleGeoFenceDrawerContent)));
