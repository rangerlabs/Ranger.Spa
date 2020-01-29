import * as React from 'react';
import IntegrationService from '../../../../services/IntegrationService';
import { Formik, FormikProps, FormikBag, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, CssBaseline, List, ListItemText, Typography, ListItem } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../../form/FormikTextField';
import FormikCancelButton from '../../../form/FormikCancelButton';
import { IRestResponse } from '../../../../services/RestUtilities';
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
import KeyValuePair from '../../../../models/KeyValuePair';
import { IntegrationEnum } from '../../../../models/app/integrations/IntegrationEnum';

const integrationService = new IntegrationService();

const styles = (theme: Theme) =>
    createStyles({
        layout: {
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
        flexButtonContainer: {
            display: 'flex',
        },
        leftButtons: {
            flexGrow: 1,
        },
    });
interface IWebhookIntegrationFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    dispatchAddIntegration: (integration: WebhookIntegration) => void;
    dispatchRemoveIntegration: (name: string) => void;
    integrationsState?: MergedIntegrationType[];
    initialIntegration: WebhookIntegration;
    selectedProject: IProject;
    push: typeof push;
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
    return { integrationsState: state.integrationsState, selectedProject: state.selectedProject };
};

type WebhookIntegrationFormState = {
    serverErrors: string[];
    isSuccess: boolean;
};

class WebhookIntegrationForm extends React.Component<IWebhookIntegrationFormProps, WebhookIntegrationFormState> {
    formikRef: React.RefObject<Formik> = React.createRef();
    state: WebhookIntegrationFormState = {
        serverErrors: undefined,
        isSuccess: false,
    };

    deleteIntegration(name: string, enqueueSnackbar: any) {}

    validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        url: Yup.string()
            .url('Must be a valid URL')
            .required('Required'),
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
    });

    render() {
        const { classes, enqueueSnackbar, dispatchAddIntegration } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={0}>
                        <Typography align="center" variant="h5" gutterBottom>
                            {this.props.initialIntegration ? 'Edit Webhook Integration' : 'Create a Webhook Integration'}
                        </Typography>

                        <Formik
                            ref={this.formikRef}
                            enableReinitialize
                            initialValues={
                                this.props.initialIntegration
                                    ? this.props.initialIntegration
                                    : ({
                                          type: IntegrationEnum.WEBHOOK,
                                          projectName: '',
                                          name: '',
                                          description: '',
                                          url: '',
                                          headers: [],
                                          metadata: [],
                                      } as WebhookIntegration)
                            }
                            onSubmit={(values: WebhookIntegration, formikBag: FormikBag<FormikProps<WebhookIntegration>, WebhookIntegration>) => {
                                this.setState({ serverErrors: undefined });
                                const newIntegration = new WebhookIntegration();
                                newIntegration.projectName = this.props.selectedProject.name;
                                newIntegration.name = values.name;
                                newIntegration.description = values.description;
                                newIntegration.url = values.url;
                                newIntegration.headers = values.headers;
                                newIntegration.metadata = values.metadata;
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
                                                disabled={props.initialValues.name === '' ? false : true}
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
                                            <FormikTextField
                                                name="url"
                                                label="URL"
                                                value={props.values.url}
                                                errorText={props.errors.url}
                                                touched={props.touched.url}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                autoComplete="off"
                                                required
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
                                        />
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
                                                        this.deleteIntegration(props.values.name, enqueueSnackbar);
                                                    }}
                                                    dialogTitle="Delete integration?"
                                                    confirmText="Delete"
                                                    dialogContent={'Are you sure you want to delete integration ' + props.values.name + '?'}
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
                                            {props.initialValues.name === '' ? 'Create Webhook' : 'Update Webhook'}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withSnackbar(integrationForm(WebhookIntegrationForm))));
