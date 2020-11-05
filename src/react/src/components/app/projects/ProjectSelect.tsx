import * as React from 'react';
import { selectProject } from '../../../redux/actions/SelecteProjectActions';
import { Theme, createStyles, WithStyles, withStyles, Card, CardHeader, CardContent, Typography, Grid, ButtonBase, IconButton, Paper } from '@material-ui/core';
import ArrowLeft from 'mdi-material-ui/ArrowLeft';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import * as queryString from 'query-string';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import { ProjectsState } from '../../../redux/actions/ProjectActions';
import { resetMapGeofences, resetTableGeofences } from '../../../redux/actions/GeofenceActions';
import { resetIntegrations } from '../../../redux/actions/IntegrationActions';
import classNames from 'classnames';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
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
        root: {
            display: 'flex',
            minWidth: '100%',
        },
        card: {
            flexGrow: 1,
            height: '100%',
        },
        content: {
            width: '100%',
        },
        cover: {
            width: 151,
        },
        grid: {
            padding: theme.spacing(2),
        },
        title: {
            marginTop: '0px',
            padding: '0px',
        },
        return: {
            position: 'sticky',
            top: theme.toolbar.height + theme.spacing(4),
            marginLeft: theme.spacing(4),
        },
        mediaRoot: {
            backgroundSize: 'contain',
        },
        buttonBase: {
            minWidth: '100%',
        },
        rootPadding: {
            padding: theme.spacing(1),
        },
    });

interface ProjectSelectProps extends WithStyles<typeof styles> {
    projectsState: ProjectsState;
    selectProject: (project: IProject) => void;
    push: typeof push;
    resetGeofences: () => void;
    resetIntegrations: () => void;
    selectedProject: IProject;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        projectsState: state.projectsState,
        selectedProject: state.selectedProject,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        selectProject: (project: IProject) => {
            const action = selectProject(project);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
        resetGeofences: () => {
            dispatch(resetMapGeofences());
            dispatch(resetTableGeofences());
        },
        resetIntegrations: () => {
            dispatch(resetIntegrations());
        },
    };
};

class ProjectSelect extends React.Component<ProjectSelectProps> {
    getRedirectFromParams(): string {
        const params = queryString.parse(window.location.search);
        const redirect = params['redirect'] as string;
        return redirect;
    }

    handleProjectClick(project: IProject) {
        this.props.projectsState.projects.filter((a) => a.name === project.name);
        if (this.props.selectedProject?.id !== project.id) {
            this.props.selectProject(project);
            this.props.resetGeofences();
            this.props.resetIntegrations();
        }
        const redirect = this.getRedirectFromParams();
        if (redirect) {
            this.props.push('/' + project.name + redirect);
        } else {
            this.props.push(RoutePaths.GeofenceMap.replace(':appName', project.name));
        }
    }

    render() {
        const { classes, projectsState } = this.props;
        return (
            <React.Fragment>
                <IconButton className={classes.return} onClick={() => this.props.push(RoutePaths.Integrations)}>
                    <ArrowLeft />
                </IconButton>
                <Typography className={classNames(classes.title, classes.layout)} variant="h5" align="left">
                    Select a Project
                </Typography>
                <div className={classes.layout}>
                    <Grid container spacing={3} direction="column" justify="flex-start" alignItems="center">
                        {projectsState.projects.map((project, index) => (
                            <Grid key={index} container item justify="center">
                                <Grid item xs={12}>
                                    <Paper elevation={3}>
                                        <ButtonBase
                                            className={classes.buttonBase}
                                            onClick={() => {
                                                this.handleProjectClick(project);
                                            }}
                                        >
                                            <Card elevation={0} className={classes.root}>
                                                <CardContent className={classes.content}>
                                                    <Typography align="center" variant="h6">
                                                        {project.name}
                                                    </Typography>
                                                    <Typography align="center" variant="subtitle1" color="textSecondary">
                                                        {project.description}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </ButtonBase>
                                    </Paper>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(ProjectSelect)));
