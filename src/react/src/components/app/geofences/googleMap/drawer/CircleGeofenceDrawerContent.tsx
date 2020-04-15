import * as React from 'react';
import { Formik, FormikProps, FormikBag } from 'formik';
import FormikTextField from '../../../../form/FormikTextField';
import FormikCancelButton from '../../../../form/FormikCancelButton';
import FormikDeleteButton from '../../../../form/FormikDeleteButton';
import FormikCheckbox from '../../../../form/FormikCheckbox';
import CircleGeofence from '../../../../../models/app/geofences/CircleGeofence';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { Theme, createStyles, WithStyles, List, ListItem, ListItemText, withStyles, Grid, FormLabel, Typography } from '@material-ui/core';
import { CircleGeofenceState } from '../../../../../redux/actions/GoogleMapsActions';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { addGeofence, addGeofenceToPendingDeletion, addGeofenceToPendingUpdate } from '../../../../../redux/actions/GeofenceActions';
import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import FormikSynchronousButton from '../../../../form/FormikSynchronousButton';
import { push } from 'connected-react-router';
import IProject from '../../../../../models/app/IProject';
import { MergedIntegrationType } from '../../../../../models/app/integrations/MergedIntegrationTypes';
import { getIntegrationsFromIntegrationIds } from '../../../../../helpers/Helpers';
import FormikAutocompleteLabelMultiselect from '../../../../form/FormikAutocompleteLabelMultiselect';
import GeofenceService from '../../../../../services/GeofenceService';
import { StatusEnum } from '../../../../../models/StatusEnum';
import FormikDictionaryBuilder from '../../../../form/FormikDictionaryBuilder';
import FormikScheduleBuilder from '../../../../form/FormikScheduleBuilder';
import Schedule from '../../../../../models/Schedule';
import { isValid } from 'date-fns';

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
        toolbar: {
            height: theme.toolbar.height * 1.5,
        },
        bottomPush: {
            height: theme.toolbar.height,
        },
    });

interface CircleGeofenceFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    mapGeofence: CircleGeofenceState;
    editGeofence?: CircleGeofence;
    selectedProject: IProject;
    integrations: MergedIntegrationType[];
    closeDrawer: () => void;
    openDialog: (dialogCotent: DialogContent) => void;
    saveGeofenceToState: (geofence: CircleGeofence) => void;
    addGeofenceToPendingDeletion: (geofence: CircleGeofence) => void;
    addGeofenceToPendingUpdate: (geofence: CircleGeofence) => void;
    clearNewCircleGeofence: () => void;
    enableMapClick: () => void;
    push: (path: string) => void;
}

interface CircleGeofenceFormState {
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
        saveGeofenceToState: (geofence: CircleGeofence) => {
            const action = addGeofence(geofence);
            dispatch(action);
        },
        addGeofenceToPendingDeletion: (geofence: CircleGeofence) => {
            const action = addGeofenceToPendingDeletion(geofence);
            dispatch(action);
        },
        addGeofenceToPendingUpdate: (geofence: CircleGeofence) => {
            const action = addGeofenceToPendingUpdate(geofence);
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
            this.state = {
                serverErrors: undefined,
                selectedIntegrations: getIntegrationsFromIntegrationIds(this.props.editGeofence.integrationIds, this.props.integrations),
                isSuccess: false,
                cancelClicked: false,
            };
        }
    }

    formikRef: React.RefObject<Formik> = React.createRef();

    state: CircleGeofenceFormState = {
        serverErrors: undefined,
        selectedIntegrations: [],
        isSuccess: false,
        cancelClicked: false,
    };

    cancelSaveGeofence = (formikBag: FormikBag<FormikProps<CircleGeofence>, CircleGeofence>) => {
        formikBag.setSubmitting(false);
    };

    saveGeofence = (geofence: CircleGeofence) => {
        geofenceService.postGeofence(this.props.selectedProject.name, geofence).then((v) => {
            if (!v.isError) {
                this.setState({ isSuccess: true });
                geofence.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                this.props.saveGeofenceToState(geofence);
                this.props.clearNewCircleGeofence();
                this.props.enqueueSnackbar(`Geofence '${geofence.externalId}' is pending creation.`, { variant: 'info' });
                this.props.enableMapClick();
                this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
                this.props.closeDrawer();
            }
            this.formikRef.current.setSubmitting(false);
            this.setState({ isSuccess: false });
        });
    };

    updateGeofence = (geofence: CircleGeofence) => {
        geofenceService.putGeofence(this.props.selectedProject.name, geofence.id, geofence).then((v) => {
            if (!v.isError) {
                this.setState({ isSuccess: true });
                geofence.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                this.props.addGeofenceToPendingUpdate(this.props.editGeofence);
                this.props.saveGeofenceToState(geofence);
                this.props.enqueueSnackbar(`Geofence '${geofence.externalId}' is pending update.`, { variant: 'info' });
                this.props.clearNewCircleGeofence();
                this.props.enableMapClick();
                this.props.push('/' + this.props.selectedProject.name + '/geofences/map');
                this.props.closeDrawer();
            }
            this.formikRef.current.setSubmitting(false);
            this.setState({ isSuccess: false });
        });
    };

    deleteGeofence = () => {
        geofenceService.deleteGeofence(this.props.selectedProject.name, this.props.editGeofence.externalId).then((v) => {
            if (!v.isError) {
                this.props.editGeofence.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                this.props.addGeofenceToPendingDeletion(this.props.editGeofence);
                this.props.clearNewCircleGeofence();
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
        this.props.clearNewCircleGeofence();
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
        schedule: Yup.object().shape({
            timeZoneId: Yup.string().required('Required.'),
            sunday: Yup.object().shape({
                startTime: Yup.date().typeError('Invalid time format.').required(),
                endTime: Yup.date().typeError('Invalid time format.').required().timeGreaterThan(),
            }),
            monday: Yup.object().shape({
                startTime: Yup.date().typeError('Invalid time format.').required(),
                endTime: Yup.date().typeError('Invalid time format.').required().timeGreaterThan(),
            }),
            tuesday: Yup.object().shape({
                startTime: Yup.date().typeError('Invalid time format.').required(),
                endTime: Yup.date().typeError('Invalid time format.').required().timeGreaterThan(),
            }),
            wednesday: Yup.object().shape({
                startTime: Yup.date().typeError('Invalid time format.').required(),
                endTime: Yup.date().typeError('Invalid time format.').required().timeGreaterThan(),
            }),
            thursday: Yup.object().shape({
                startTime: Yup.date().typeError('Invalid time format.').required(),
                endTime: Yup.date().typeError('Invalid time format.').required().timeGreaterThan(),
            }),
            friday: Yup.object().shape({
                startTime: Yup.date().typeError('Invalid time format.').required(),
                endTime: Yup.date().typeError('Invalid time format.').required().timeGreaterThan(),
            }),
            saturday: Yup.object().shape({
                startTime: Yup.date().typeError('Invalid time format.').required(),
                endTime: Yup.date().typeError('Invalid time format.').required().timeGreaterThan(),
            }),
        }),
    });

    getIntegrationNamesByIds(integrationIds: string[]) {
        if (integrationIds) {
            return this.props.integrations
                .filter((i) => integrationIds.includes(i.integrationId))
                .map((i) => i.name)
                .sort();
        }
        return [];
    }
    getIntegrationIdsByNames(integrationNames: string[]) {
        if (integrationNames) {
            return this.props.integrations
                .filter((i) => integrationNames.includes(i.name))
                .map((i) => i.integrationId)
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
                enableReinitialize={false}
                initialValues={
                    this.props.editGeofence
                        ? ({
                              ...this.props.editGeofence,
                              integrationIds: this.getIntegrationNamesByIds(this.props.editGeofence.integrationIds),
                          } as CircleGeofence)
                        : new CircleGeofence(
                              this.props.selectedProject.projectId,
                              '',
                              [],
                              true,
                              true,
                              true,
                              true,
                              '',
                              [],
                              [new CoordinatePair(0, 0)],
                              [],
                              0,
                              Schedule.FullUtcSchedule()
                          )
                }
                onSubmit={(values: CircleGeofence, formikBag: FormikBag<FormikProps<CircleGeofence>, CircleGeofence>) => {
                    const newFence = new CircleGeofence(
                        this.props.selectedProject.projectId,
                        values.externalId,
                        values.labels,
                        values.onEnter,
                        values.onDwell,
                        values.onExit,
                        values.enabled,
                        values.description,
                        this.getIntegrationIdsByNames(values.integrationIds),
                        [new CoordinatePair(this.props.mapGeofence.center.lng, this.props.mapGeofence.center.lat)],
                        values.metadata,
                        this.props.mapGeofence.radius,
                        values.schedule
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
                {(props) => (
                    <form className={classes.form} onSubmit={props.handleSubmit}>
                        <div className={classes.toolbar} />
                        <Typography gutterBottom variant="h5">
                            {this.props.editGeofence ? 'Edit Geofence' : 'Create Geofence'}
                        </Typography>
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
                            <Grid container item xs={12} spacing={0}>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                    <FormLabel component="label">Send events when users</FormLabel>
                                </Grid>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                    <FormikCheckbox
                                        infoText="Send events when a user enters this geofence."
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
                                        infoText="Send events when a user has entered and is continuing to dwell within this geofence."
                                        name="onDwell"
                                        label="Dwell"
                                        value={props.values.onDwell}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        disabled={this.isPendingCreation()}
                                    />
                                </Grid>
                                <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                    <FormikCheckbox
                                        infoText="Send events when a user has entered and then exits this geofence."
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
                                <FormikAutocompleteLabelMultiselect
                                    infoText="The integrations to execute for the geofence."
                                    name="integrations"
                                    label="Integrations"
                                    placeholder=""
                                    enabled={!this.isPendingCreation()}
                                    options={this.props.integrations.map((v) => v.name)}
                                    defaultValue={this.props.editGeofence ? this.getIntegrationNamesByIds(this.props.editGeofence.integrationIds) : []}
                                    onChange={(event: React.ChangeEvent<{}>, values: string[]) => {
                                        this.formikRef.current.setFieldValue('integrationIds', values, true);
                                    }}
                                />
                            </Grid>
                            <Grid className={classes.width100TemporaryChromiumFix} item xs={12}>
                                <FormikScheduleBuilder
                                    name="schedule"
                                    onScheduleChange={(fieldName: string, value: Date) => {
                                        this.formikRef.current.setFieldValue(fieldName, isValid(value) ? value.toISOString() : value, true);
                                    }}
                                    onTimeZoneChange={(fieldName: string, value: string) => {
                                        this.formikRef.current.setFieldValue(fieldName, value, true);
                                    }}
                                    onBlur={props.handleBlur}
                                    touched={props.touched.schedule as any}
                                    errors={props.errors.schedule as any}
                                    schedule={props.values.schedule}
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
                                            {this.state.serverErrors.map((error) => (
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
                                        dialogContent={'Are you sure you want to delete the geofence named ' + props.values.externalId + '?'}
                                        confirmText="Delete geofence"
                                        onConfirm={() => {
                                            this.deleteGeofence();
                                        }}
                                        isSubmitting={props.isSubmitting}
                                        disabled={this.isPendingCreation()}
                                    >
                                        Delete
                                    </FormikDeleteButton>
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
                        <div className={classes.bottomPush} />
                    </form>
                )}
            </Formik>
        );
    }
    private showNoIntegrationsWithTriggersDialog(newFence: CircleGeofence) {
        return newFence.integrationIds.length === 0 && (newFence.onEnter || newFence.onDwell || newFence.onExit);
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withSnackbar(CircleGeofenceDrawerContent)));
