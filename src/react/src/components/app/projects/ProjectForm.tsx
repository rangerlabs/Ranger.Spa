import * as React from 'react';
import IProject from '../../../models/app/IProject';
import ProjectService from '../../../services/ProjectService';
import { Formik, FormikProps, FormikBag, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { withStyles, createStyles, Theme, WithStyles, Paper, Grid, CssBaseline, List, ListItemText, Typography, ListItem, TextField } from '@material-ui/core';
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
    dispatchAddProject: (project: IProject) => void;
    dispatchUpdateProject: (project: IProject) => void;
    dispatchRemoveProject: (name: string) => void;
    closeForm: () => void;
    projectsState?: ProjectsState;
    push: typeof push;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        dispatchAddProject: (project: IProject) => {
            const action = addProject(project);
            dispatch(action);
        },
        dispatchUpdateProject: (project: IProject) => {
            const action = updateProject(project);
            dispatch(action);
        },
        dispatchRemoveProject: (id: string) => {
            const action = removeProject(id);
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
    state: ProjectFormState = {
        serverErrors: undefined as string[],
        initialProject: undefined,
        isSuccess: false,
    };

    deleteProject(id: string, enqueueSnackbar: any) {
        console.log('DELETE THE APPLICATION');
        setTimeout(() => {
            this.props.dispatchRemoveProject(id);
            enqueueSnackbar('Project deleted', { variant: 'error' });
            this.props.push(RoutePaths.Projects);
        }, 250);
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
        const { classes, projectsState, enqueueSnackbar, dispatchAddProject, dispatchUpdateProject } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper elevation={0}>
                        <Typography variant="h5" gutterBottom>
                            {this.state.initialProject ? 'Edit' : 'Create'}
                        </Typography>

                        <Formik
                            enableReinitialize
                            initialValues={
                                this.state.initialProject ? this.state.initialProject : { name: '', description: '', apiKey: '', version: 0, enabled: true }
                            }
                            onSubmit={(values: IProject, formikBag: FormikBag<FormikProps<IProject>, IProject>) => {
                                console.log(values);
                                this.setState({ serverErrors: undefined });
                                const inputProject = {
                                    name: values.name,
                                    description: values.description,
                                    apiKey: values.apiKey,
                                    enabled: values.enabled,
                                } as IProject;
                                if (this.state.initialProject) {
                                    const editedProject = Object.assign({}, inputProject, { version: this.state.initialProject.version + 1 }) as IProject;
                                    projectService.putProject(editedProject, this.state.initialProject.projectId).then((response: IRestResponse<IProject>) => {
                                        setTimeout(() => {
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
                                        }, 2000);
                                    });
                                } else {
                                    projectService.postProject(inputProject).then((response: IRestResponse<IProject>) => {
                                        setTimeout(() => {
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
                                                this.props.push(RoutePaths.Projects);
                                            }
                                        }, 2000);
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
                                        {props.values.apiKey && (
                                            <Grid item xs={12}>
                                                <TextField name="apiKey" label="Api Key" value={props.values.apiKey} fullWidth disabled />
                                            </Grid>
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
                                                    dialogContent={DeleteProjectContent}
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
