import * as React from 'react';
import IProject from '../../../models/app/IProject';
import ProjectService from '../../../services/ProjectService';
import { Formik, FormikProps, FormikBag, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, Button, WithStyles, Paper, Grid, Typography, TextField, IconButton } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../form/FormikTextField';
import { IRestResponse, IValidationError } from '../../../services/RestUtilities';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import FormikDeleteButton from '../../form/FormikDeleteButton';
import FormikSynchronousButton from '../../form/FormikSynchronousButton';
import { addProject, removeProject, ProjectsState, updateProject } from '../../../redux/actions/ProjectActions';
import RoutePaths from '../../RoutePaths';
import * as queryString from 'query-string';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import DeleteProjectContent from '../dialogContents/DeleteProjectContent';
import FormikCheckbox from '../../form/FormikCheckbox';
import FormikValidationErrors from '../../form/FormikServerErrors';
import { openDialog, closeDialog, DialogContent } from '../../../redux/actions/DialogActions';
import NewProjectApiKeysContent from '../dialogContents/NewProjectApiKeysContent';
import NewProjectEnvironmentApiKeyContent from '../dialogContents/NewProjectEnvironmentApiKeyContent';
import titleCase = require('title-case');
import { ApiKeyPurposeNameEnum } from '../../../models/ApiKeyPurposeNameEnum';
import { User } from 'oidc-client';
import { userIsInRole } from '../../../helpers/Helpers';
import { RoleEnum } from '../../../models/RoleEnum';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import Constants from '../../../theme/Constants';
import classNames from 'classnames';

const projectService = new ProjectService();

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
        disableBottomPadding: {
            paddingBottom: '0px !important',
        },
    });
interface IProjectFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    openDialog: (dialogContent: DialogContent) => void;
    closeDialog: () => void;
    dispatchAddProject: (project: IProject) => void;
    dispatchUpdateProject: (project: IProject) => void;
    closeForm: () => void;
    projectsState?: ProjectsState;
    push: typeof push;
    user: User;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(dialogContent);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
        dispatchAddProject: (project: IProject) => {
            const action = addProject(project);
            dispatch(action);
        },
        dispatchUpdateProject: (project: IProject) => {
            const action = updateProject(project);
            dispatch(action);
        },
        closeDialog: () => {
            const action = closeDialog();
            dispatch(action);
        },
    };
};

const mapStateToProps = (state: ApplicationState) => {
    return { projectsState: state.projectsState, user: state.oidc.user };
};

type ProjectFormState = {
    serverErrors: IValidationError[];
    initialProject: IProject;
    isSuccess: boolean;
};

class ProjectForm extends React.Component<IProjectFormProps, ProjectFormState> {
    state: ProjectFormState = {
        serverErrors: undefined as IValidationError[],
        initialProject: undefined,
        isSuccess: false,
    };

    resetApiKey(environment: string, environmentName: string, formikProps: FormikProps<any>) {
        this.props.openDialog(
            new DialogContent(
                `Are you sure you want to reset the ${titleCase(
                    environmentName
                )} API Key for this project? The current API Key will become ineffective immediately.`,
                'Reset API Key',
                `Reset ${titleCase(environmentName)} API Key`,
                () => {
                    const project = { version: this.state.initialProject.version + 1 } as IProject;
                    projectService.apiKeyReset(project, this.state.initialProject.projectId, environment).then((response: IRestResponse<IProject>) => {
                        if (response.isError) {
                            const { validationErrors: serverErrors, ...formikErrors } = response.error;
                            this.props.enqueueSnackbar(response.error.message, { variant: 'error' });
                            formikProps.setStatus(formikErrors as FormikErrors<IProject>);
                            this.setState({ serverErrors: serverErrors });
                        } else {
                            this.props.enqueueSnackbar(response.message, { variant: 'success' });
                            if (environment === ApiKeyPurposeNameEnum.LIVE) {
                                this.props.openDialog(
                                    new DialogContent(
                                        NewProjectEnvironmentApiKeyContent({
                                            environmentName: ApiKeyPurposeNameEnum.LIVE,
                                            newApiKey: response.result.liveApiKey,
                                            onClose: this.props.closeDialog,
                                        })
                                    )
                                );
                            } else if (environment === ApiKeyPurposeNameEnum.TEST) {
                                this.props.openDialog(
                                    new DialogContent(
                                        NewProjectEnvironmentApiKeyContent({
                                            environmentName: ApiKeyPurposeNameEnum.TEST,
                                            newApiKey: response.result.testApiKey,
                                            onClose: this.props.closeDialog,
                                        })
                                    )
                                );
                            } else if (environment === ApiKeyPurposeNameEnum.PROJECT) {
                                this.props.openDialog(
                                    new DialogContent(
                                        NewProjectEnvironmentApiKeyContent({
                                            environmentName: 'project',
                                            newApiKey: response.result.projectApiKey,
                                            onClose: this.props.closeDialog,
                                        })
                                    )
                                );
                            }
                            this.props.dispatchUpdateProject(response.result);
                            this.setState({ initialProject: response.result });
                        }
                    });
                    formikProps.setSubmitting(false);
                }
            )
        );
    }

    componentDidMount() {
        const project = this.getProjectByName(this.props.projectsState.projects);
        if (project) {
            this.setState({ initialProject: project });
        }
    }

    getProjectByName = (projects: IProject[]) => {
        let result = undefined;
        const params = queryString.parse(window.location.search);
        const name = params['name'] as string;
        if (name && projects) {
            result = projects.find((p) => p.name === name);
        }

        return result;
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required('Required').max(140, 'Must be 140 characters or less.'),
    });

    render() {
        const { classes, enqueueSnackbar, dispatchAddProject, dispatchUpdateProject } = this.props;
        return (
            <Formik
                enableReinitialize={true}
                initialValues={this.state.initialProject ? this.state.initialProject : { name: '', description: '', version: 0, enabled: true }}
                onSubmit={(values: IProject, formikBag: FormikBag<FormikProps<IProject>, IProject>) => {
                    this.setState({ serverErrors: undefined });
                    const inputProject = {
                        name: values.name,
                        description: values.description,
                        enabled: values.enabled,
                    } as IProject;
                    if (this.state.initialProject) {
                        const editedProject = Object.assign({}, inputProject, { version: this.state.initialProject.version + 1 }) as IProject;
                        projectService.putProject(editedProject, this.state.initialProject.projectId).then((response: IRestResponse<IProject>) => {
                            if (response.isError) {
                                const { validationErrors: serverErrors, ...formikErrors } = response.error;
                                enqueueSnackbar(response.error.message, { variant: 'error' });
                                formikBag.setStatus(formikErrors as FormikErrors<IProject>);
                                this.setState({ serverErrors: serverErrors });
                                formikBag.setSubmitting(false);
                            } else {
                                this.setState({ isSuccess: true });
                                enqueueSnackbar(response.message, { variant: 'success' });
                                dispatchUpdateProject(response.result);
                                this.props.push(RoutePaths.Projects);
                            }
                        });
                    } else {
                        projectService.postProject(inputProject).then((response: IRestResponse<IProject>) => {
                            if (response.isError) {
                                const { validationErrors: serverErrors, ...formikErrors } = response.error;
                                enqueueSnackbar(response.error.message, { variant: 'error' });
                                formikBag.setStatus(formikErrors as FormikErrors<IProject>);
                                this.setState({ serverErrors: serverErrors });
                                formikBag.setSubmitting(false);
                            } else {
                                this.setState({ isSuccess: true });
                                enqueueSnackbar(response.message, { variant: 'success' });
                                dispatchAddProject(response.result);
                                this.props.openDialog(
                                    new DialogContent(
                                        NewProjectApiKeysContent({
                                            liveApiKey: response.result.liveApiKey,
                                            testApiKey: response.result.testApiKey,
                                            projectApiKey: response.result.projectApiKey,
                                            onClose: this.props.closeDialog,
                                        })
                                    )
                                );
                                this.props.push(RoutePaths.Projects);
                            }
                        });
                    }
                }}
                validationSchema={this.validationSchema}
            >
                {(props) => (
                    <React.Fragment>
                        <IconButton className={classes.return} disabled={props.isSubmitting} onClick={() => this.props.push(RoutePaths.Projects)}>
                            <ArrowLeft />
                        </IconButton>
                        <Typography className={classNames(classes.title, classes.paper)} align="left" variant="h5">
                            {this.state.initialProject ? (userIsInRole(this.props.user, RoleEnum.ADMIN) ? 'Edit Project' : 'View Project') : 'New Project'}
                        </Typography>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Project Details
                            </Typography>
                            <form onSubmit={props.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid className={classes.disableBottomPadding} item xs={12}>
                                        <FormikCheckbox
                                            infoText="Whether the project should accept incoming requests."
                                            name="enabled"
                                            label="Enabled"
                                            value={props.values.enabled}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            disabled={Boolean(!userIsInRole(this.props.user, RoleEnum.ADMIN))}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormikTextField
                                            infoText="A unique identifier for the project."
                                            name="name"
                                            label="Name"
                                            value={props.values.name}
                                            errorText={props.errors.name}
                                            touched={props.touched.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            required={!this.state.initialProject && Boolean(!userIsInRole(this.props.user, RoleEnum.ADMIN))}
                                            disabled={Boolean(!userIsInRole(this.props.user, RoleEnum.ADMIN))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormikTextField
                                            infoText="An optional description for the project."
                                            name="description"
                                            label="Description"
                                            value={props.values.description}
                                            errorText={props.errors.description}
                                            touched={props.touched.description}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            autoComplete="off"
                                            disabled={Boolean(!userIsInRole(this.props.user, RoleEnum.ADMIN))}
                                        />
                                    </Grid>
                                    {this.state.initialProject && (
                                        <React.Fragment>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Live API Key Prefix"
                                                    value={`${this.state.initialProject.liveApiKeyPrefix}...`}
                                                    fullWidth
                                                    disabled
                                                    InputProps={
                                                        userIsInRole(this.props.user, RoleEnum.ADMIN) && {
                                                            endAdornment: (
                                                                <Button
                                                                    disabled={props.isSubmitting}
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        this.resetApiKey('live', 'live', props);
                                                                    }}
                                                                >
                                                                    Reset
                                                                </Button>
                                                            ),
                                                        }
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Test API Key Prefix"
                                                    value={`${this.state.initialProject.testApiKeyPrefix}...`}
                                                    fullWidth
                                                    disabled
                                                    InputProps={
                                                        userIsInRole(this.props.user, RoleEnum.ADMIN) && {
                                                            endAdornment: (
                                                                <Button
                                                                    disabled={props.isSubmitting}
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        this.resetApiKey('test', 'test', props);
                                                                    }}
                                                                >
                                                                    Reset
                                                                </Button>
                                                            ),
                                                        }
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Project API Key Prefix"
                                                    value={`${this.state.initialProject.projectApiKeyPrefix}...`}
                                                    fullWidth
                                                    disabled
                                                    InputProps={
                                                        userIsInRole(this.props.user, RoleEnum.ADMIN) && {
                                                            endAdornment: (
                                                                <Button
                                                                    disabled={props.isSubmitting}
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        this.resetApiKey('proj', 'project', props);
                                                                    }}
                                                                >
                                                                    Reset
                                                                </Button>
                                                            ),
                                                        }
                                                    }
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                    {this.state.serverErrors && (
                                        <Grid item xs={12}>
                                            <FormikValidationErrors errors={this.state.serverErrors} />
                                        </Grid>
                                    )}
                                </Grid>
                                {userIsInRole(this.props.user, RoleEnum.ADMIN) && (
                                    <Grid container justify="flex-end">
                                        <Grid item>
                                            <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.isSuccess}>
                                                {props.initialValues.name === '' ? 'Create' : 'Update'}
                                            </FormikSynchronousButton>
                                        </Grid>
                                    </Grid>
                                )}
                            </form>
                        </Paper>
                        {userIsInRole(this.props.user, RoleEnum.ADMIN) && this.state.initialProject && (
                            <Paper className={classNames(classes.bottomPaper, classes.paper)} elevation={3}>
                                <Typography variant="h6">Delete</Typography>
                                <Typography variant="subtitle1">Remove the project and all associated configuration.</Typography>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <FormikDeleteButton
                                            isSubmitting={props.isSubmitting}
                                            dialogTitle={`Delete ${this.state.initialProject.name}?`}
                                            dialogContent={
                                                <DeleteProjectContent id={this.state.initialProject.projectId} name={this.state.initialProject.name} />
                                            }
                                        >
                                            Delete
                                        </FormikDeleteButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}
                    </React.Fragment>
                )}
            </Formik>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(withSnackbar(ProjectForm))));
