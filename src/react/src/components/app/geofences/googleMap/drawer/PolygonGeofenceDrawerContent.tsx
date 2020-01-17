import * as React from 'react';
import { Formik, FormikProps, FormikBag } from 'formik';
import FormikTextField from '../../../../form/FormikTextField';
import FormikCancelButton from '../../../../form/FormikCancelButton';
import FormikCheckbox from '../../../../form/FormikCheckbox';
import PolygonGeofence from '../../../../../models/app/geofences/PolygonGeofence';
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
import { getIntegrationsFromIntegrationIds } from '../../../../../helpers/Helpers';
import FormikAutocompleteLabelMultiselect from '../../../../form/FormikAutocompleteLabelMultiselect';
import GeofenceService from '../../../../../services/GeofenceService';

const geofenceService = new GeofenceService();

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
    cancelClicked: boolean;
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
                cancelClicked: false,
            };
        }
    }

    formikRef: React.RefObject<Formik> = React.createRef();

    state: PolygonGeofenceFormState = {
        serverErrors: undefined,
        selectedIntegrations: [],
        isSuccess: false,
        cancelClicked: false,
    };

    componentWillUnmount() {
        if (this.props.editGeofence && !this.state.isSuccess && !this.state.cancelClicked) {
            this.props.saveGeofenceToState(this.props.editGeofence);
            this.props.clearNewPolygonGeofence();
            this.props.enableMapClick();
        }
    }

    cancelSaveGeofence = (formikBag: FormikBag<FormikProps<PolygonGeofence>, PolygonGeofence>) => {
        formikBag.setSubmitting(false);
    };

    saveGeofence = (geofence: PolygonGeofence) => {
        geofenceService.postGeofence(this.props.selectedProject.name, geofence).then(v => {
            if (!v.is_error) {
                this.setState({ isSuccess: true });
                this.props.saveGeofenceToState(geofence);
                this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
                this.props.closeDrawer();
                this.props.enableMapClick();
                this.props.clearNewPolygonGeofence();
            }
            this.formikRef.current.setSubmitting(false);
            this.setState({ isSuccess: false });
        });
    };

    deleteGeofence = (name: string) => {
        //delete from server
        setTimeout(() => {
            this.setState({ isSuccess: true });
            this.props.removeGeofenceFromState(name);
            this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
            this.props.closeDrawer();
            this.props.enableMapClick();
            this.props.clearNewPolygonGeofence();
            this.props.enqueueSnackbar('Geofence deleted.', { variant: 'error' });
        }, 500);
    };

    cancelGeofenceEdit = () => {
        this.setState({ cancelClicked: true });
        this.props.saveGeofenceToState(this.props.editGeofence);
        this.props.clearNewPolygonGeofence();
        this.props.enableMapClick();
        this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
        this.props.closeDrawer();
    };

    cancelGeofenceCreate = () => {
        this.setState({ cancelClicked: true });
        this.props.clearNewPolygonGeofence();
        this.setState({ serverErrors: undefined });
        this.props.enableMapClick();
        this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
        this.props.closeDrawer();
    };

    validationSchema = Yup.object().shape({
        externalId: Yup.string().required('Required'),
        description: Yup.string().notRequired(),
    });

    getIntegrationNamesByIds(integrationIds: string[]) {
        return this.props.integrations
            .filter(i => integrationIds.includes(i.id))
            .map(i => i.name)
            .sort();
    }
    getIntegrationIdsByNames(integrationNames: string[]) {
        return this.props.integrations
            .filter(i => integrationNames.includes(i.name))
            .map(i => i.id)
            .sort();
    }

    render() {
        const { classes } = this.props;
        return (
            <Formik
                ref={this.formikRef}
                enableReinitialize
                initialValues={
                    this.props.editGeofence
                        ? ({
                              ...this.props.editGeofence,
                              integrationIds: this.getIntegrationNamesByIds(this.props.editGeofence.integrationIds),
                          } as PolygonGeofence)
                        : new PolygonGeofence(
                              this.props.selectedProject.projectId,
                              '',
                              [],
                              true,
                              true,
                              true,
                              '',
                              [],
                              [new CoordinatePair(0, 0)],
                              new Map<string, object>()
                          )
                }
                isInitialValid={this.props.editGeofence ? true : false}
                onSubmit={(values: PolygonGeofence, formikBag: FormikBag<FormikProps<PolygonGeofence>, PolygonGeofence>) => {
                    const newFence = new PolygonGeofence(
                        this.props.selectedProject.projectId,
                        values.externalId,
                        values.labels,
                        values.onEnter,
                        values.onExit,
                        values.enabled,
                        values.description,
                        this.getIntegrationIdsByNames(values.integrationIds),
                        this.props.mapGeofence.coordinatePairArray,
                        new Map<string, object>()
                    );

                    if (this.showNoIntegrationsWithTriggersDialog(newFence)) {
                        const content = new DialogContent(
                            'Are you sure you want to save this geofence without any integrations? Triggers will have no effect.',
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
                                    name="externalId"
                                    label="External Id"
                                    value={props.values.externalId}
                                    errorText={props.errors.externalId}
                                    touched={props.touched.externalId}
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
                                <FormikAutocompleteLabelMultiselect
                                    name="integrations"
                                    label="Integrations"
                                    placeholder=""
                                    enabled
                                    options={this.props.integrations.map(v => v.name)}
                                    defaultValue={this.props.editGeofence ? this.getIntegrationNamesByIds(this.props.editGeofence.integrationIds) : []}
                                    onChange={(event: React.ChangeEvent<{}>, values: string[]) => {
                                        this.formikRef.current.setFieldValue('integrationIds', values, true);
                                    }}
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
                                    />
                                )}
                            </div>

                            <FormikCancelButton
                                isSubmitting={props.isSubmitting}
                                onClick={() => {
                                    props.initialValues.externalId === '' ? this.cancelGeofenceCreate() : this.cancelGeofenceEdit();
                                }}
                            />

                            <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.isSuccess}>
                                {props.initialValues.externalId === '' ? 'Create' : 'Update'}
                            </FormikSynchronousButton>
                        </div>
                    </form>
                )}
            </Formik>
        );
    }
    private showNoTriggersDialog(newFence: PolygonGeofence) {
        return !newFence.onEnter && !newFence.onExit;
    }

    private showNoIntegrationsWithTriggersDialog(newFence: PolygonGeofence) {
        return newFence.integrationIds.length === 0 && (newFence.onEnter || newFence.onEnter);
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withSnackbar(PolygonGeofenceDrawerContent)));
