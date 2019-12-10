import * as React from 'react';
import { Formik, FormikProps, FormikBag } from 'formik';
import FormikTextField from '../../../../form/FormikTextField';
import FormikCancelButton from '../../../../form/FormikCancelButton';
import FormikCheckbox from '../../../../form/FormikCheckbox';
import PolygonGeofence from '../../../../../models/app/geofences/PolygonGeofence';
import PolygonGeofenceRequest from '../../../../../models/app/geofences/PolygonGeofenceRequest';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { Theme, createStyles, WithStyles, List, ListItem, ListItemText, withStyles, Grid, FormLabel } from '@material-ui/core';
import { PolygonGeofenceState } from '../../../../../redux/actions/GoogleMapsActions';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import { addGeofence } from '../../../../../redux/actions/GeofenceActions';
import { removeGeofence } from '../../../../../redux/actions/GeofenceActions';
import FormikDeleteButton from '../../../../form/FormikDeleteButton';
import FormikSynchronousButton from '../../../../form/FormikSynchronousButton';
import { push } from 'connected-react-router';
import IProject from '../../../../../models/app/IProject';
import { MergedIntegrationResponseType } from '../../../../../models/app/integrations/MergedIntegrationTypes';
import FormikAutocompleteMultiselect from '../../../../form/FormikAutocompleteMulitselect';
import { getIntegrationsFromIntegrationIds } from '../../../../../helpers/Helpers';

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

interface PolygonGeofenceFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    mapGeofence: PolygonGeofenceState;
    editGeofence: PolygonGeofence;
    selectedProject: IProject;
    integrations: MergedIntegrationResponseType[];
    closeDrawer: () => void;
    openDialog: (dialogCotent: DialogContent) => void;
    saveGeofenceToState: (geofence: PolygonGeofence) => void;
    removeGeofenceFromState: (name: string) => void;
    clearNewPolygonGeofence: () => void;
    enableMapClick: () => void;
    push: (path: string) => void;
}

interface PolygonGeofenceFormState {
    serverErrors: string[];
    selectedIntegrations: MergedIntegrationResponseType[];
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
        saveGeofenceToState: (geofence: PolygonGeofence) => {
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

class PolygonGeofenceDrawerContent extends React.Component<PolygonGeofenceFormProps, PolygonGeofenceFormState> {
    constructor(props: PolygonGeofenceFormProps) {
        super(props);
        if (this.props.editGeofence) {
            this.state = {
                serverErrors: undefined,
                selectedIntegrations: getIntegrationsFromIntegrationIds(this.props.editGeofence.integrationIds, this.props.integrations),
                isSuccess: false,
            };
        }
    }

    formikRef: React.RefObject<Formik> = React.createRef();

    state: PolygonGeofenceFormState = {
        serverErrors: undefined,
        selectedIntegrations: [],
        isSuccess: false,
    };

    cancelSaveGeofence = (formikBag: FormikBag<FormikProps<PolygonGeofence>, PolygonGeofence>) => {
        formikBag.setSubmitting(false);
        this.props.enableMapClick();
    };

    saveGeofence = (geofence: PolygonGeofenceRequest) => {
        //save to server
        setTimeout(() => {
            this.setState({ isSuccess: true });
            const geofenceResponse = new PolygonGeofence(
                this.props.selectedProject.name,
                geofence.name,
                geofence.labels,
                geofence.onEnter,
                geofence.onExit,
                geofence.enabled,
                geofence.description,
                geofence.integrationIds,
                geofence.coordinates,
                geofence.metadata
            );
            this.props.saveGeofenceToState(geofenceResponse);
            this.props.clearNewPolygonGeofence();
            this.props.enqueueSnackbar('Geofence saved.', { variant: 'success' });
            this.props.enableMapClick();
            this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
            this.props.closeDrawer();
        }, 500);
    };

    deleteGeofence = (name: string) => {
        //delete from server
        setTimeout(() => {
            this.setState({ isSuccess: true });
            this.props.removeGeofenceFromState(name);
            this.props.clearNewPolygonGeofence();
            this.props.enqueueSnackbar('Geofence deleted.', { variant: 'error' });
            this.props.enableMapClick();
            this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
            this.props.closeDrawer();
        }, 500);
    };

    cancelGeofenceEdit = () => {
        this.props.saveGeofenceToState(this.props.editGeofence);
        this.props.clearNewPolygonGeofence();
        this.props.enableMapClick();
        this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map');
        this.props.closeDrawer();
    };

    cancelGeofenceCreate = () => {
        this.props.clearNewPolygonGeofence();
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
                enableReinitialize
                initialValues={
                    this.props.editGeofence
                        ? this.props.editGeofence
                        : new PolygonGeofenceRequest('', [], true, true, true, '', [], [new CoordinatePair(0, 0)], new Map<string, object>())
                }
                isInitialValid={this.props.editGeofence ? true : false}
                onSubmit={(values: PolygonGeofence, formikBag: FormikBag<FormikProps<PolygonGeofence>, PolygonGeofence>) => {
                    console.log(values);
                    const newFence = new PolygonGeofenceRequest(
                        values.name,
                        values.labels,
                        values.onEnter,
                        values.onExit,
                        values.enabled,
                        values.description,
                        this.state.selectedIntegrations.map(i => i.id),
                        this.props.mapGeofence.coordinatePairArray,
                        new Map<string, object>()
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
                                <FormikAutocompleteMultiselect
                                    name="integrations"
                                    label="Select integrations"
                                    placeholder=""
                                    options={this.props.integrations}
                                    getOptionLabel={(integration: MergedIntegrationResponseType) => integration.name}
                                    onChange={(values: MergedIntegrationResponseType[]) => this.setState({ selectedIntegrations: values })}
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
                                        dialogContent={'Are you sure you want to delete the geofence named ' + props.values.name + '?'}
                                        dialogTitle="Delete geofence?"
                                        confirmText="Delete geofence"
                                        onConfirm={() => {
                                            this.deleteGeofence(props.values.name);
                                        }}
                                        isSubmitting={props.isSubmitting}
                                        variant="outlined"
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
    private showNoTriggersDialog(newFence: PolygonGeofenceRequest) {
        return !newFence.onEnter && !newFence.onExit;
    }

    private showNoIntegrationsWithTriggersDialog(newFence: PolygonGeofenceRequest) {
        return newFence.integrationIds.length === 0 && (newFence.onEnter || newFence.onEnter);
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withSnackbar(PolygonGeofenceDrawerContent)));
