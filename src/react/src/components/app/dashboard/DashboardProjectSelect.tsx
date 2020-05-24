import * as React from 'react';
import { selectProject } from '../../../redux/actions/SelecteProjectActions';
import {
    Theme,
    createStyles,
    WithStyles,
    withStyles,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CardActions,
    IconButton,
    GridList,
    GridListTile,
} from '@material-ui/core';
import HexagonMultiple from 'mdi-material-ui/HexagonMultiple';
import ArrowDecision from 'mdi-material-ui/ArrowDecision';
import MapMarker from 'mdi-material-ui/MapMarker';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
const IntegrationApi = require('../../../../assets/integration-api.png');
import { ProjectsState } from '../../../redux/actions/ProjectActions';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import { resetGeofences } from '../../../redux/actions/GeofenceActions';
import { resetIntegrations } from '../../../redux/actions/IntegrationActions';

const styles = (theme: Theme) =>
    createStyles({
        card: {
            margin: '10px',
        },
        cardContent: {
            paddingBottom: '0px',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0px',
        },
        media: {
            height: 0,
            paddingTop: '64px',
        },
        layout: {
            width: 'auto',
            margin: theme.spacing(2),
        },
        mediaRoot: {
            backgroundSize: 'contain',
        },
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            width: '100%',
            // backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: '100%',
            flexWrap: 'nowrap',
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
        },
        gridListTile: {
            height: '100% !important',
        },
    });

interface ProjectsSelectProps extends WithStyles<typeof styles> {
    projectsState: ProjectsState;
    selectedProject: IProject;
    selectProject: (project: IProject) => void;
    push: typeof push;
    resetGeofences: () => void;
    resetIntegrations: () => void;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        projectsState: state.projectsState,
        selectedProjected: state.selectedProject,
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
            dispatch(resetGeofences());
        },
        resetIntegrations: () => {
            dispatch(resetIntegrations());
        },
    };
};

class DashboardProjectSelect extends React.Component<ProjectsSelectProps> {
    handleProjectGeofencesClick(project: IProject) {
        if (this.props.selectedProject?.projectId !== project.projectId) {
            this.props.selectProject(project);
            this.props.resetGeofences();
            this.props.resetIntegrations();
        }
        this.props.push(RoutePaths.GeofenceMap.replace(':appName', this.props.selectedProject.name));
    }
    handleProjectIntegrationsClick(project: IProject) {
        if (this.props.selectedProject?.projectId !== project.projectId) {
            this.props.selectProject(project);
            this.props.resetGeofences();
            this.props.resetIntegrations();
        }
        this.props.push(RoutePaths.Integrations.replace(':appName', this.props.selectedProject.name));
    }
    handleProjectClick(project: IProject) {
        if (this.props.selectedProject?.projectId !== project.projectId) {
            this.props.selectProject(project);
            this.props.resetGeofences();
            this.props.resetIntegrations();
        }
        this.props.push(`${RoutePaths.ProjectsEdit}?name=${project.name}`);
    }
    render() {
        const { classes, projectsState } = this.props;
        return (
            <React.Fragment>
                <div className={classes.root}>
                    <GridList className={classes.gridList} cols={2.75}>
                        {projectsState.projects &&
                            projectsState.projects.map(project => (
                                <GridListTile className={classes.gridListTile} key={project.name}>
                                    <Card elevation={3} className={classes.card}>
                                        <CardHeader title={project.name} />
                                        <CardContent classes={{ root: classes.cardContent }}>
                                            <Typography component="p">{project.description}</Typography>
                                        </CardContent>
                                        <CardActions className={classes.buttons}>
                                            <IconButton
                                                onClick={() => {
                                                    this.handleProjectGeofencesClick(project);
                                                }}
                                                aria-label="Project Geofences"
                                            >
                                                <MapMarker color="primary" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    this.handleProjectIntegrationsClick(project);
                                                }}
                                                aria-label="Project integrations"
                                            >
                                                <ArrowDecision color="primary" />
                                            </IconButton>

                                            <IconButton
                                                onClick={() => {
                                                    this.handleProjectClick(project);
                                                }}
                                                aria-label="Project"
                                            >
                                                <HexagonMultiple color="primary" />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </GridListTile>
                            ))}
                    </GridList>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(DashboardProjectSelect)));
