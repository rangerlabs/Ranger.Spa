import * as React from 'react';
import IProject from '../../../models/app/IProject';
import ProjectService from '../../../services/ProjectService';
import { Formik, FormikProps, FormikBag, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, Button, WithStyles, Paper, Grid, CssBaseline, Typography, TextField, InputAdornment } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import FormikTextField from '../../form/FormikTextField';
import FormikCancelButton from '../../form/FormikCancelButton';
import { IRestResponse } from '../../../services/RestUtilities';
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
import FormikServerErrors from '../../form/FormikServerErrors';
import { openDialog, closeDialog, DialogContent } from '../../../redux/actions/DialogActions';
import NewProjectApiKeysContent from '../dialogContents/NewProjectApiKeysContent';
import NewProjectEnvironmentApiKeyContent from '../dialogContents/NewProjectEnvironmentApiKeyContent';
import titleCase = require('title-case');
import { ProjectEnvironmentEnum } from '../../../models/ProjectEnvironmentEnum';

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
    });
interface IProjectFormProps extends WithStyles<typeof styles>, WithSnackbarProps {
    openDialog: (dialogContent: DialogContent) => void;
    closeDialog: () => void;
    dispatchAddProject: (project: IProject) => void;
    dispatchUpdateProject: (project: IProject) => void;
    closeForm: () => void;
    projectsState?: ProjectsState;
    push: typeof push;
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
    return { projectsState: state.projectsState };
};

type ProjectFormState = {
    serverErrors: string[];
    initialProject: IProject;
    isSuccess: boolean;
};

class ProjectForm extends React.Component<IProjectFormProps, ProjectFormState> {
    formikRef: React.RefObject<Formik> = React.createRef();
    state: ProjectFormState = {
        serverErrors: undefined as string[],
        initialProject: undefined,
        isSuccess: false,
    };

    resetApiKey(environment: string) {
        this.props.openDialog(
            new DialogContent(
                `Are you sure you want to reset the ${titleCase(environment)} API key this project? The current API key will become ineffective immediately.`,
                'Reset API Key',
                `Reset ${titleCase(environment)} API Key`,
                () => {
                    const project = { version: this.state.initialProject.version + 1 } as IProject;
                    projectService.apiKeyReset(project, this.state.initialProject.projectId, environment).then((response: IRestResponse<IProject>) => {
                        if (response.is_error) {
                            const { errors: serverErrors, ...formikErrors } = response.error_content;
                            this.props.enqueueSnackbar('Error resetting API key', { variant: 'error' });
                            this.formikRef.current.setErrors(formikErrors as FormikErrors<IProject>);
                            this.setState({ serverErrors: serverErrors });
                            this.formikRef.current.setSubmitting(false);
                        } else {
                            this.setState({ isSuccess: true });
                            this.props.enqueueSnackbar('API key reset', { variant: 'success' });
                            if (environment === ProjectEnvironmentEnum.LIVE) {
                                this.props.openDialog(
                                    new DialogContent(
                                        NewProjectEnvironmentApiKeyContent({
                                            environment: ProjectEnvironmentEnum.LIVE,
                                            newApiKey: response.content.liveApiKey,
                                            onClose: this.props.closeDialog,
                                        })
                                    )
                                );
                            } else {
                                this.props.openDialog(
                                    new DialogContent(
                                        NewProjectEnvironmentApiKeyContent({
                                            environment: ProjectEnvironmentEnum.TEST,
                                            newApiKey: response.content.testApiKey,
                                            onClose: this.props.closeDialog,
                                        })
                                    )
                                );
                            }
                            this.props.dispatchUpdateProject(response.content);
                            this.props.push(RoutePaths.Projects);
                        }
                    });
                }
            )
        );
    }

    deleteProject(id: string, enqueueSnackbar: any) {}

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
            result = projects.find(p => p.name === name);
        }

        return result;
    };

    validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Required')
            .max(140, 'Must be 140 characters or less.'),
    });

    render() {
        const { classes, closeDialog, enqueueSnackbar, dispatchAddProject, dispatchUpdateProject } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={0}>
                        <Typography variant="h5" gutterBottom>
                            {this.state.initialProject ? 'Edit Project' : 'New Project'}
                        </Typography>
                        <Formik
                            ref={this.formikRef}
                            enableReinitialize
                            initialValues={this.state.initialProject ? this.state.initialProject : { name: '', description: '', version: 0, enabled: true }}
                            onSubmit={(values: IProject, formikBag: FormikBag<FormikProps<IProject>, IProject>) => {
                                console.log(values);
                                this.setState({ serverErrors: undefined });
                                const inputProject = {
                                    name: values.name,
                                    description: values.description,
                                    enabled: values.enabled,
                                } as IProject;
                                if (this.state.initialProject) {
                                    const editedProject = Object.assign({}, inputProject, { version: this.state.initialProject.version + 1 }) as IProject;
                                    projectService.putProject(editedProject, this.state.initialProject.projectId).then((response: IRestResponse<IProject>) => {
                                        if (response.is_error) {
                                            const { errors: serverErrors, ...formikErrors } = response.error_content;
                                            enqueueSnackbar('Error updating project', { variant: 'error' });
                                            formikBag.setErrors(formikErrors as FormikErrors<IProject>);
                                            this.setState({ serverErrors: serverErrors });
                                            formikBag.setSubmitting(false);
                                        } else {
                                            this.setState({ isSuccess: true });
                                            enqueueSnackbar('Project updated', { variant: 'success' });
                                            dispatchUpdateProject(response.content);
                                            this.props.push(RoutePaths.Projects);
                                        }
                                    });
                                } else {
                                    projectService.postProject(inputProject).then((response: IRestResponse<IProject>) => {
                                        if (response.is_error) {
                                            const { errors: serverErrors, ...formikErrors } = response.error_content;
                                            enqueueSnackbar('Error creating project', { variant: 'error' });
                                            formikBag.setErrors(formikErrors as FormikErrors<IProject>);
                                            this.setState({ serverErrors: serverErrors });
                                            formikBag.setSubmitting(false);
                                        } else {
                                            this.setState({ isSuccess: true });
                                            enqueueSnackbar('Project created', { variant: 'success' });
                                            dispatchAddProject(response.content);
                                            this.props.openDialog(
                                                new DialogContent(
                                                    NewProjectApiKeysContent({
                                                        liveApiKey: response.content.liveApiKey,
                                                        testApiKey: response.content.testApiKey,
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
                            {props => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid className={classes.disableBottomPadding} item xs={12}>
                                            <FormikCheckbox
                                                name="enabled"
                                                label="Enabled"
                                                value={props.values.enabled}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                        </Grid>

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
                                        {this.state.initialProject && (
                                            <React.Fragment>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Live API Key Prefix"
                                                        value={`${this.state.initialProject.liveApiKeyPrefix}...`}
                                                        fullWidth
                                                        disabled
                                                        InputProps={{
                                                            endAdornment: (
                                                                <Button
                                                                    disabled={props.isSubmitting}
                                                                    onClick={() => {
                                                                        this.resetApiKey('live');
                                                                    }}
                                                                >
                                                                    Reset
                                                                </Button>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Test API Key Prefix"
                                                        value={`${this.state.initialProject.testApiKeyPrefix}...`}
                                                        fullWidth
                                                        disabled
                                                        InputProps={{
                                                            endAdornment: (
                                                                <Button
                                                                    disabled={props.isSubmitting}
                                                                    onClick={() => {
                                                                        this.resetApiKey('test');
                                                                    }}
                                                                >
                                                                    Reset
                                                                </Button>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            </React.Fragment>
                                        )}
                                        {this.state.serverErrors && (
                                            <Grid item xs={12}>
                                                <FormikServerErrors errors={this.state.serverErrors} />
                                            </Grid>
                                        )}
                                    </Grid>
                                    <div className={classes.flexButtonContainer}>
                                        <div className={classes.leftButtons}>
                                            {this.state.initialProject && (
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
                                        <FormikSynchronousButton isValid={props.isValid} isSubmitting={props.isSubmitting} isSuccess={this.state.isSuccess}>
                                            {props.initialValues.name === '' ? 'Create' : 'Update'}
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(populateProjectsHOC(withSnackbar(ProjectForm))));
