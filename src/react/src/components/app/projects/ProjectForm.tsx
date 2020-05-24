import * as React from 'react';
import IProject from '../../../models/app/IProject';
import ProjectService from '../../../services/ProjectService';
import { Formik, FormikProps, FormikBag, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, Button, WithStyles, Paper, Grid, CssBaseline, Typography, TextField, InputAdornment } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../form/FormikTextField';
import FormikCancelButton from '../../form/FormikCancelButton';
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
import { ProjectEnvironmentEnum } from '../../../models/ProjectEnvironmentEnum';
import { User } from 'oidc-client';
import { userIsInRole } from '../../../helpers/Helpers';
import { RoleEnum } from '../../../models/RoleEnum';

const projectService = new ProjectService();

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
        disableBottomPadding: {
            paddingBottom: '0px !important',
        },
        paper: {
            padding: theme.spacing(4),
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

    resetApiKey(environment: string, formikProps: FormikProps<any>) {
        this.props.openDialog(
            new DialogContent(
                `Are you sure you want to reset the ${titleCase(environment)} API Key this project? The current API Key will become ineffective immediately.`,
                'Reset API Key',
                `Reset ${titleCase(environment)} API Key`,
                () => {
                    const project = { version: this.state.initialProject.version + 1 } as IProject;
                    projectService.apiKeyReset(project, this.state.initialProject.projectId, environment).then((response: IRestResponse<IProject>) => {
                        if (response.isError) {
                            const { validationErrors: serverErrors, ...formikErrors } = response.error;
                            this.props.enqueueSnackbar(response.error.message, { variant: 'error' });
                            formikProps.setStatus(formikErrors as FormikErrors<IProject>);
                            this.setState({ serverErrors: serverErrors });
                            formikProps.setSubmitting(false);
                        } else {
                            this.setState({ isSuccess: true });
                            this.props.enqueueSnackbar(response.message, { variant: 'success' });
                            if (environment === ProjectEnvironmentEnum.LIVE) {
                                this.props.openDialog(
                                    new DialogContent(
                                        NewProjectEnvironmentApiKeyContent({
                                            environment: ProjectEnvironmentEnum.LIVE,
                                            newApiKey: response.result.liveApiKey,
                                            onClose: this.props.closeDialog,
                                        })
                                    )
                                );
                            } else {
                                this.props.openDialog(
                                    new DialogContent(
                                        NewProjectEnvironmentApiKeyContent({
                                            environment: ProjectEnvironmentEnum.TEST,
                                            newApiKey: response.result.testApiKey,
                                            onClose: this.props.closeDialog,
                                        })
                                    )
                                );
                            }
                            this.props.dispatchUpdateProject(response.result);
                        }
                    });
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
        const { classes, closeDialog, enqueueSnackbar, dispatchAddProject, dispatchUpdateProject } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper} elevation={3}>
                        <Typography align="center" variant="h5" gutterBottom>
                            {this.state.initialProject ? (userIsInRole(this.props.user, RoleEnum.ADMIN) ? 'Edit Project' : 'View Project') : 'New Project'}
                        </Typography>
                        <Formik
                            enableReinitialize
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
                                                                        onClick={() => {
                                                                            this.resetApiKey('live', props);
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
                                                                        onClick={() => {
                                                                            this.resetApiKey('test', props);
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
                                    <div className={classes.flexButtonContainer}>
                                        <div className={classes.leftButtons}>
                                            {userIsInRole(this.props.user, RoleEnum.ADMIN) && this.state.initialProject && (
                                                <FormikDeleteButton
                                                    isSubmitting={props.isSubmitting}
                                                    dialogTitle={`Delete ${this.state.initialProject.name}?`}
                                                    dialogContent={
                                                        <DeleteProjectContent id={this.state.initialProject.projectId} name={this.state.initialProject.name} />
                                                    }
                                                >
                                                    Delete
                                                </FormikDeleteButton>
                                            )}
                                        </div>
                                        <FormikCancelButton
                                            isSubmitting={props.isSubmitting}
                                            onClick={() => {
                                                this.props.push('/projects');
                                            }}
                                        />
                                        {userIsInRole(this.props.user, RoleEnum.ADMIN) && (
                                            <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.isSuccess}>
                                                {props.initialValues.name === '' ? 'Create Project' : 'Update Project'}
                                            </FormikSynchronousButton>
                                        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(withSnackbar(ProjectForm))));
