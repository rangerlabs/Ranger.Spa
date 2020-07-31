import * as React from 'react';
import { Formik, FormikProps, FormikBag } from 'formik';
import * as Yup from 'yup';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    Paper,
    Grid,
    List,
    ListItemText,
    Typography,
    ListItem,
    IconButton,
    Box,
    Tooltip,
} from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../../form/FormikTextField';
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
import classNames from 'classnames';
import ContentCopy from 'mdi-material-ui/ContentCopy';
import CopyToClipboard from 'react-copy-to-clipboard';
import RegularExpressions from '../../../../helpers/RegularExpressions';

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(4),
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.spacing(3),
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        return: {
            position: 'sticky',
            top: theme.toolbar.height + theme.spacing(4),
            marginLeft: theme.spacing(4),
        },
        toolbar: {
            height: Constants.HEIGHT.TOOLBAR,
        },
        title: {
            marginTop: '0px',
            padding: '0px',
        },
        bottomPaper: {
            marginBottom: theme.spacing(3),
        },
        signingKey: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
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
    canEdit: boolean;
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
        name: Yup.string()
            .required('Required')
            .min(3, 'Min 3 characters')
            .max(128, 'Max 128 characters')
            .matches(new RegExp(RegularExpressions.GEOFENCE_INTEGRATION_NAME), {
                message: 'Must begin, end, and contain alphanumeric characters. May contain hyphens (-).',
            }),
        url: Yup.string().matches(new RegExp('^https', 'i'), 'Must be HTTPS').url('Must be a valid URL').required('Required'),
        headers: Yup.array()
            .of(
                Yup.object().shape({
                    key: Yup.string().required('Required'),
                    value: Yup.string().required('Required'),
                })
            )
            .max(10, 'Up to 10 headers allowed'),
        metadata: Yup.array()
            .of(
                Yup.object().shape({
                    key: Yup.string().required('Required'),
                    value: Yup.string().required('Required'),
                })
            )
            .max(10, 'Up to 10 metadata allowed'),
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
                        <IconButton className={classes.return} disabled={props.isSubmitting} onClick={() => this.props.push(RoutePaths.IntegrationsNew)}>
                            <ArrowLeft />
                        </IconButton>
                        <Typography className={classNames(classes.title, classes.paper)} align="left" variant="h5">
                            {this.props.editIntegration ? 'Edit Webhook Integration' : 'New Webhook Integration'}
                        </Typography>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Integration Details
                            </Typography>
                            <form onSubmit={props.handleSubmit}>
                                {this.props.isPendingCreation && (
                                    <Grid container item xs={12}>
                                        <Grid item xs={12}>
                                            <Typography align="center">
                                                This integration is pending creation. Updates can be issued after the integration is created.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                )}
                                <Grid container item xs={12}>
                                    <Grid item xs={12}>
                                        <FormikCheckbox
                                            infoText="Whether the integration will execute for geofences."
                                            name="enabled"
                                            label="Enabled"
                                            value={props.values.enabled}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            disabled={this.props.isPendingCreation || !this.props.canEdit}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormikSelect
                                            infoText="The API key environment for which the integration will be called."
                                            name="environment"
                                            label="Environment"
                                            value={props.values.environment}
                                            selectValues={this.props.environmentSelectValuesArray}
                                            errorText={props.errors.environment}
                                            touched={props.touched.environment}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            required
                                            disabled={this.props.isPendingCreation || !this.props.canEdit}
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
                                            disabled={this.props.isPendingCreation || !this.props.canEdit}
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
                                            disabled={this.props.isPendingCreation || !this.props.canEdit}
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
                                            disabled={this.props.isPendingCreation || !this.props.canEdit}
                                        />
                                    </Grid>
                                    <FormikDictionaryBuilder
                                        name="headers"
                                        title="Headers"
                                        addTooltipText="Add a header."
                                        infoText="Headers are sent with each request to the endpoint. Sensitive data may be stored in the headers. All headers are encrypted at rest."
                                        valueArray={props.values.headers}
                                        errorsArray={props.errors.headers as any}
                                        touchedArray={props.touched.headers as any}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        keyRequired
                                        valueRequired
                                        disabled={this.props.isPendingCreation || !this.props.canEdit}
                                    />
                                    <FormikDictionaryBuilder
                                        name="metadata"
                                        title="Metadata"
                                        addTooltipText="Add a metadata."
                                        infoText="Metadata are static fields that are sent as a part of the request body."
                                        valueArray={props.values.metadata}
                                        errorsArray={props.errors.metadata as any}
                                        touchedArray={props.touched.metadata as any}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        keyRequired
                                        valueRequired
                                        disabled={this.props.isPendingCreation || !this.props.canEdit}
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
                                    {this.props.canEdit && (
                                        <Grid container justify="flex-end">
                                            <Grid item>
                                                <FormikSynchronousButton
                                                    variant="outlined"
                                                    isValid={props.isValid}
                                                    isSubmitting={props.isSubmitting}
                                                    isSuccess={this.props.isSuccess}
                                                    disabled={this.props.isPendingCreation}
                                                >
                                                    {props.initialValues.name === '' ? 'Create' : 'Update'}
                                                </FormikSynchronousButton>
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            </form>
                        </Paper>
                        {this.props.editIntegration && (
                            <React.Fragment>
                                <Paper className={classNames(classes.bottomPaper, classes.paper)} elevation={3}>
                                    <Typography variant="h6">Signing Key</Typography>
                                    <Typography variant="subtitle1">The key used to sign the ID of an event payload using the HMAC-SHA-1 algorithm.</Typography>
                                    <Grid container>
                                        <Grid item xs={11}>
                                            <Box marginTop={3}>
                                                <Typography className={classes.signingKey} variant="body1">
                                                    {props.values.signingKey}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <CopyToClipboard text={props.values.signingKey}>
                                                <Tooltip title="Copy Signing Key" placement="bottom">
                                                    <IconButton aria-label="Copy Signing Key">
                                                        <ContentCopy />
                                                    </IconButton>
                                                </Tooltip>
                                            </CopyToClipboard>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                {this.props.canEdit && (
                                    <Paper className={classNames(classes.bottomPaper, classes.paper)} elevation={3}>
                                        <Typography variant="h6">Delete</Typography>
                                        <Typography variant="subtitle1">Remove the integration</Typography>
                                        <Grid container justify="flex-end">
                                            <Grid item>
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
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </Formik>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withSnackbar(integrationForm(WebhookIntegrationForm))));
