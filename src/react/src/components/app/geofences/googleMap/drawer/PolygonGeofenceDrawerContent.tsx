import * as React from 'react';
import { Formik, FormikProps, FormikBag } from 'formik';
import FormikTextField from '../../../../form/FormikTextField';
import FormikCancelButton from '../../../../form/FormikCancelButton';
import FormikCheckbox from '../../../../form/FormikCheckbox';
import PolygonGeofence from '../../../../../models/app/geofences/PolygonGeofence';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { Theme, createStyles, WithStyles, List, ListItem, ListItemText, withStyles, Grid, FormLabel, Typography } from '@material-ui/core';
import { PolygonGeofenceState } from '../../../../../redux/actions/GoogleMapsActions';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import { addGeofence, addGeofenceToPendingUpdate } from '../../../../../redux/actions/GeofenceActions';
import { addGeofenceToPendingDeletion } from '../../../../../redux/actions/GeofenceActions';
import FormikDeleteButton from '../../../../form/FormikDeleteButton';
import FormikSynchronousButton from '../../../../form/FormikSynchronousButton';
import { push } from 'connected-react-router';
import IProject from '../../../../../models/app/IProject';
import { MergedIntegrationType } from '../../../../../models/app/integrations/MergedIntegrationTypes';
import { getIntegrationsFromIntegrationIds } from '../../../../../helpers/Helpers';
import FormikAutocompleteLabelMultiselect from '../../../../form/FormikAutocompleteLabelMultiselect';
import GeofenceService from '../../../../../services/GeofenceService';
import { StatusEnum } from '../../../../../models/StatusEnum';
import CircleGeofence from '../../../../../models/app/geofences/CircleGeofence';
import CorrelationModel from '../../../../../models/CorrelationModel';
import FormikDictionaryBuilder from '../../../../form/FormikDictionaryBuilder';

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
    integrations: MergedIntegrationType[];
    closeDrawer: () => void;
    openDialog: (dialogCotent: DialogContent) => void;
    saveGeofenceToState: (geofence: PolygonGeofence) => void;
    addGeofenceToPendingDeletion: (geofence: PolygonGeofence) => void;
    addGeofenceToPendingUpdate: (geofence: PolygonGeofence) => void;
    clearNewPolygonGeofence: () => void;
    enableMapClick: () => void;
    push: (path: string) => void;
}

interface PolygonGeofenceFormState {
    serverErrors: string[];
    selectedIntegrations: MergedIntegrationType[];
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
        addGeofenceToPendingDeletion: (geofence: PolygonGeofence) => {
            const action = addGeofenceToPendingDeletion(geofence);
            dispatch(action);
        },
        addGeofenceToPendingUpdate: (geofence: PolygonGeofence) => {
            const action = addGeofenceToPendingUpdate(geofence);
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

    cancelSaveGeofence = (formikBag: FormikBag<FormikProps<PolygonGeofence>, PolygonGeofence>) => {
        formikBag.setSubmitting(false);
    };

    saveGeofence = (geofence: PolygonGeofence) => {
        geofenceService.postGeofence(this.props.selectedProject.name, geofence).then(v => {
            if (!v.is_error) {
                this.setState({ isSuccess: true });
                geofence.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                this.props.saveGeofenceToState(geofence);
                this.props.enqueueSnackbar(`Geofence '${geofence.externalId}' is pending creation.`, { variant: 'info' });
                this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
                this.props.closeDrawer();
                this.props.enableMapClick();
                this.props.clearNewPolygonGeofence();
            }
            this.formikRef.current.setSubmitting(false);
            this.setState({ isSuccess: false });
        });
    };

    updateGeofence = (geofence: PolygonGeofence) => {
        geofenceService.putGeofence(this.props.selectedProject.name, geofence.id, geofence).then(v => {
            if (!v.is_error) {
                this.setState({ isSuccess: true });
                geofence.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                this.props.addGeofenceToPendingUpdate(this.props.editGeofence);
                this.props.saveGeofenceToState(geofence);
                this.props.enqueueSnackbar(`Geofence '${geofence.externalId}' is pending update.`, { variant: 'info' });
                this.props.clearNewPolygonGeofence();
                this.props.enableMapClick();
                this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
                this.props.closeDrawer();
            }
            this.formikRef.current.setSubmitting(false);
            this.setState({ isSuccess: false });
        });
    };

    deleteGeofence = () => {
        geofenceService.deleteGeofence(this.props.selectedProject.name, this.props.editGeofence.externalId).then(v => {
            if (!v.is_error) {
                this.props.editGeofence.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                this.props.addGeofenceToPendingDeletion(this.props.editGeofence);
                this.props.clearNewPolygonGeofence();
                this.props.enqueueSnackbar(`Geofence '${this.props.editGeofence.externalId}' is pending deletion.`, { variant: 'info' });
                this.props.enableMapClick();
                this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
                this.props.closeDrawer();
            }
            this.formikRef.current.setSubmitting(false);
            this.setState({ isSuccess: false });
        });
    };

    cancelGeofence = () => {
        this.setState({ cancelClicked: true });
        if (this.props.editGeofence) {
            this.props.saveGeofenceToState(this.props.editGeofence);
        }
        this.props.clearNewPolygonGeofence();
        this.setState({ serverErrors: undefined });
        this.props.enableMapClick();
        this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
        this.props.closeDrawer();
    };

    validationSchema = Yup.object().shape({
        externalId: Yup.string().required('Required'),
        description: Yup.string().notRequired(),
        metadata: Yup.array().of(
            Yup.object().shape({
                key: Yup.string().required('Required'),
                value: Yup.string().required('Required'),
            })
        ),
    });

    getIntegrationNamesByIds(integrationIds: string[]) {
        if (integrationIds) {
            return this.props.integrations
                .filter(i => integrationIds.includes(i.id))
                .map(i => i.name)
                .sort();
        }
        return [];
    }
    getIntegrationIdsByNames(integrationNames: string[]) {
        if (integrationNames) {
            return this.props.integrations
                .filter(i => integrationNames.includes(i.name))
                .map(i => i.id)
                .sort();
        }
        return [];
    }

    isPendingCreation() {
        return this.props.editGeofence?.correlationModel?.status === StatusEnum.PENDING && !this.props.editGeofence?.id;
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
                        : new PolygonGeofence(this.props.selectedProject.projectId, '', [], true, true, true, '', [], [new CoordinatePair(0, 0)], [])
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
                        values.metadata
                    );
                    newFence.id = this.props.editGeofence?.id;

                    const saveOrUpdate = this.props.editGeofence ? this.updateGeofence : this.saveGeofence;

                    if (this.showNoIntegrationsWithTriggersDialog(newFence)) {
                        const content = new DialogContent(
                            'Are you sure you want to save this geofence without any integrations? Triggers will have no effect.',
                            'Save geofence with no integrations?',
                            'Save geofence',
                            () => {
                                saveOrUpdate(newFence);
                            },
                            () => {
                                this.cancelSaveGeofence(formikBag);
                            }
                        );
                        this.props.openDialog(content);
                    } else {
                        saveOrUpdate(newFence);
                    }
                }}
                validationSchema={this.validationSchema}
            >
                {props => (
                    <form className={classes.form} onSubmit={props.handleSubmit}>
                        <Grid container direction="column" spacing={4}>
                            {this.isPendingCreation() && (
                                <Grid container item xs={12} spacing={0}>
                                    <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                        <Typography align="center" color="error">
                                            This geofence is pending creation. Please wait until the geofence is successfully created to issue updates.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                            <Grid container item xs={12} spacing={0}>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                    <FormikCheckbox
                                        infoText="Whether the geofence should execute integrations."
                                        name="enabled"
                                        label="Enabled"
                                        value={props.values.enabled}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        disabled={this.isPendingCreation()}
                                    />
                                </Grid>
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
                                        disabled={this.isPendingCreation()}
                                    />
                                </Grid>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                    <FormikCheckbox
                                        name="onExit"
                                        label="Exit"
                                        value={props.values.onExit}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        disabled={this.isPendingCreation()}
                                    />
                                </Grid>
                            </Grid>
                            <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                <FormikTextField
                                    infoText="A unique identifier for the geofence."
                                    name="externalId"
                                    label="External Id"
                                    value={props.values.externalId}
                                    errorText={props.errors.externalId}
                                    touched={props.touched.externalId}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                    required
                                    disabled={this.isPendingCreation()}
                                />
                            </Grid>
                            <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                <FormikTextField
                                    infoText="An optional description for the geofence."
                                    name="description"
                                    label="Description"
                                    value={props.values.description}
                                    errorText={props.errors.description}
                                    touched={props.touched.description}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    autoComplete="off"
                                    disabled={this.isPendingCreation()}
                                />
                            </Grid>
                            <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                <FormikAutocompleteLabelMultiselect
                                    infoText="The integrations to execute for the geofence."
                                    name="integrations"
                                    label="Integrations"
                                    placeholder=""
                                    enabled={!this.isPendingCreation()}
                                    options={this.props.integrations.map(v => v.name)}
                                    defaultValue={this.props.editGeofence ? this.getIntegrationNamesByIds(this.props.editGeofence.integrationIds) : []}
                                    onChange={(event: React.ChangeEvent<{}>, values: string[]) => {
                                        this.formikRef.current.setFieldValue('integrationIds', values, true);
                                    }}
                                />
                            </Grid>
                            <FormikDictionaryBuilder
                                name="metadata"
                                title="Metadata"
                                addTooltipText="Add a metadata."
                                infoText="Metadata are static fields that are sent as a part of the request body. All metadata are encrypted at rest."
                                valueArray={props.values.metadata}
                                errorsArray={props.errors.metadata as any}
                                touchedArray={props.touched.metadata as any}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                keyRequired
                                valueRequired
                            />
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
                                            this.deleteGeofence();
                                        }}
                                        isSubmitting={props.isSubmitting}
                                        disabled={this.isPendingCreation()}
                                    />
                                )}
                            </div>
                            <FormikCancelButton isSubmitting={props.isSubmitting} onClick={this.cancelGeofence} />
                            <FormikSynchronousButton
                                isValid={props.isValid}
                                isSubmitting={props.isSubmitting}
                                isSuccess={this.state.isSuccess}
                                disabled={this.isPendingCreation()}
                            >
                                {props.initialValues.externalId === '' ? 'Create Geofence' : 'Update Geofence'}
                            </FormikSynchronousButton>
                        </div>
                    </form>
                )}
            </Formik>
        );
    }
    private showNoIntegrationsWithTriggersDialog(newFence: PolygonGeofence) {
        return newFence.integrationIds.length === 0 && (newFence.onEnter || newFence.onEnter);
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withSnackbar(PolygonGeofenceDrawerContent)));
