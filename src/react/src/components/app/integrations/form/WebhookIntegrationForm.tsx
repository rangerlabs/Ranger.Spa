import * as React from 'react';
import { Formik, FormikProps, FormikBag, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    Paper,
    Grid,
    CssBaseline,
    List,
    ListItemText,
    Typography,
    ListItem,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../../form/FormikTextField';
import FormikCancelButton from '../../../form/FormikCancelButton';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores/index';
import { push } from 'connected-react-router';
import FormikDeleteButton from '../../../form/FormikDeleteButton';
import { MergedIntegrationType } from '../../../../models/app/integrations/MergedIntegrationTypes';
import WebhookIntegration from '../../../../models/app/integrations/implementations/WebhookIntegration';
import integrationForm from './IntegrationFormHOC';
import RoutePaths from '../../../RoutePaths';
import { addIntegration } from '../../../../redux/actions/IntegrationActions';
import FormikSynchronousButton from '../../../form/FormikSynchronousButton';
import IProject from '../../../../models/app/IProject';
import FormikDictionaryBuilder from '../../../form/FormikDictionaryBuilder';
import { IntegrationEnum } from '../../../../models/app/integrations/IntegrationEnum';
import FormikSelectValues from '../../../form/interfaces/FormikSelectValuesProp';
import FormikSelect from '../../../form/FormikSelect';
import { EnvironmentEnum } from '../../../../models/EnvironmentEnum';
import FormikCheckbox from '../../../form/FormikCheckbox';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import Constants from '../../../../theme/Constants';

const styles = (theme: Theme) =>
    createStyles({
        return: {
            margin: theme.spacing(4),
        },
        toolbar: {
            height: Constants.HEIGHT.TOOLBAR,
        },

        flexButtonContainer: {
            display: 'flex',
        },
        leftButtons: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(4),
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.toolbar.height,
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    });
interface IWebhookIntegrationFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    editIntegration: WebhookIntegration;
    selectedProject: IProject;
    save: (formikBag: FormikBag<FormikProps<MergedIntegrationType>, MergedIntegrationType>, integration: MergedIntegrationType) => void;
    update: (formikBag: FormikBag<FormikProps<MergedIntegrationType>, MergedIntegrationType>, integration: MergedIntegrationType) => void;
    delete: (formikProps: FormikProps<MergedIntegrationType>) => void;
    environmentSelectValuesArray: FormikSelectValues;
    push: typeof push;
    isSuccess: boolean;
    isPendingCreation: boolean;
    serverErrors: string[];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        dispatchAddIntegration: (integration: WebhookIntegration) => {
            const action = addIntegration(integration);
            dispatch(action);
        },
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return { selectedProject: state.selectedProject };
};

class WebhookIntegrationForm extends React.Component<IWebhookIntegrationFormProps> {
    validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        url: Yup.string().url('Must be a valid URL').required('Required'),
        headers: Yup.array().of(
            Yup.object().shape({
                key: Yup.string().required('Required'),
                value: Yup.string().required('Required'),
            })
        ),
        metadata: Yup.array().of(
            Yup.object().shape({
                key: Yup.string().required('Required'),
                value: Yup.string().required('Required'),
            })
        ),
        environment: Yup.mixed().required('Environment is required'),
    });

    render() {
        const { classes } = this.props;
        return (
            <Formik
                enableReinitialize
                initialValues={
                    this.props.editIntegration
                        ? this.props.editIntegration
                        : ({
                              type: IntegrationEnum.WEBHOOK,
                              enabled: true,
                              name: '',
                              description: '',
                              url: '',
                              headers: [],
                              metadata: [],
                              environment: EnvironmentEnum.TEST,
                          } as WebhookIntegration)
                }
                validateOnMount={false}
                onSubmit={(values: WebhookIntegration, formikBag: FormikBag<FormikProps<WebhookIntegration>, WebhookIntegration>) => {
                    this.setState({ serverErrors: undefined });
                    const newIntegration = new WebhookIntegration();
                    newIntegration.enabled = values.enabled;
                    newIntegration.integrationId = this.props.editIntegration?.integrationId;
                    newIntegration.environment = values.environment;
                    newIntegration.name = values.name;
                    newIntegration.description = values.description;
                    newIntegration.url = values.url;
                    newIntegration.headers = values.headers;
                    newIntegration.metadata = values.metadata;

                    this.props.editIntegration ? this.props.update(formikBag, newIntegration) : this.props.save(formikBag, newIntegration);
                }}
                validationSchema={this.validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <div className={classes.toolbar}>
                            <IconButton
                                size="small"
                                className={classes.return}
                                disabled={props.isSubmitting}
                                onClick={() => this.props.push(RoutePaths.Integrations)}
                            >
                                <ArrowLeft />
                            </IconButton>
                        </div>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography align="center" variant="h5" gutterBottom>
                                {this.props.editIntegration ? 'Edit Webhook Integration' : 'New Webhook Integration'}
                            </Typography>
                            <form onSubmit={props.handleSubmit}>
                                {this.props.isPendingCreation && (
                                    <Grid container item xs={12} spacing={0}>
                                        <Grid item xs={12}>
                                            <Typography align="center" color="error">
                                                This integration is pending creation. Please wait until the integration is successfully created to issue
                                                updates.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                )}
                                <Grid container item xs={12} spacing={0}>
                                    <Grid item xs={12}>
                                        <FormikCheckbox
                                            infoText="Whether the integration will execute for geofences."
                                            name="enabled"
                                            label="Enabled"
                                            value={props.values.enabled}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            disabled={this.props.isPendingCreation}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormikSelect
                                            infoText="The API Key environment for which the integration will be called."
                                            name="environment"
                                            label="Environment"
                                            value={props.values.environment}
                                            selectValues={this.props.environmentSelectValuesArray}
                                            errorText={props.errors.environment}
                                            touched={props.touched.environment}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            required
                                            disabled={this.props.isPendingCreation}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            infoText="The name of the integration."
                                            name="name"
                                            label="Name"
                                            value={props.values.name}
                                            errorText={props.errors.name}
                                            touched={props.touched.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            required
                                            disabled={this.props.isPendingCreation}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            infoText="An optional description for the integration."
                                            name="description"
                                            label="Description"
                                            value={props.values.description}
                                            errorText={props.errors.description}
                                            touched={props.touched.description}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            disabled={this.props.isPendingCreation}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            infoText="The REST endpoint to forward events to."
                                            name="url"
                                            label="URL"
                                            value={props.values.url}
                                            errorText={props.errors.url}
                                            touched={props.touched.url}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            required
                                            disabled={this.props.isPendingCreation}
                                        />
                                    </Grid>
                                    <FormikDictionaryBuilder
                                        name="headers"
                                        title="Headers"
                                        addTooltipText="Add a header."
                                        infoText="Headers are sent with each request to the endpoint. All headers are encrypted at rest."
                                        valueArray={props.values.headers}
                                        errorsArray={props.errors.headers as any}
                                        touchedArray={props.touched.headers as any}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        keyRequired
                                        valueRequired
                                        disabled={this.props.isPendingCreation}
                                    />
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
                                        disabled={this.props.isPendingCreation}
                                    />
                                    {this.props.serverErrors && (
                                        <Grid item xs={12}>
                                            <List>
                                                <ListItem>
                                                    {this.props.serverErrors.map((error) => (
                                                        <ListItemText primary={error} />
                                                    ))}
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    )}
                                </Grid>
                                <div className={classes.flexButtonContainer}>
                                    <div className={classes.leftButtons}>
                                        {this.props.editIntegration && (
                                            <FormikDeleteButton
                                                isSubmitting={props.isSubmitting}
                                                onConfirm={() => this.props.delete(props)}
                                                dialogTitle="Delete integration?"
                                                confirmText="Delete"
                                                dialogContent={'Are you sure you want to delete integration ' + props.values.name + '?'}
                                                disabled={this.props.isPendingCreation}
                                            >
                                                Delete
                                            </FormikDeleteButton>
                                        )}
                                    </div>
                                    <FormikSynchronousButton
                                        isValid={props.isValid}
                                        isSubmitting={props.isSubmitting}
                                        isSuccess={this.props.isSuccess}
                                        disabled={this.props.isPendingCreation}
                                    >
                                        {props.initialValues.name === '' ? 'Create' : 'Update'}
                                    </FormikSynchronousButton>
                                </div>
                            </form>
                        </Paper>
                    </React.Fragment>
                )}
            </Formik>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withSnackbar(integrationForm(WebhookIntegrationForm))));
