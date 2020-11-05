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
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import HexagonMultiple from 'mdi-material-ui/HexagonMultiple';
import ArrowDecision from 'mdi-material-ui/ArrowDecision';
import MapMarker from 'mdi-material-ui/MapMarker';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import { ProjectsState } from '../../../redux/actions/ProjectActions';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import { resetMapGeofences, resetTableGeofences } from '../../../redux/actions/GeofenceActions';
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
            dispatch(resetMapGeofences());
            dispatch(resetTableGeofences());
        },
        resetIntegrations: () => {
            dispatch(resetIntegrations());
        },
    };
};

const DashboardProjectSelect = function (props: ProjectsSelectProps) {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

    const handleProjectGeofencesClick = function (project: IProject) {
        if (props.selectedProject?.id !== project.id) {
            props.selectProject(project);
            props.resetGeofences();
            props.resetIntegrations();
        }
        props.push(RoutePaths.GeofenceMap.replace(':appName', props.selectedProject.name));
    };
    const handleProjectIntegrationsClick = function (project: IProject) {
        if (props.selectedProject?.id !== project.id) {
            props.selectProject(project);
            props.resetGeofences();
            props.resetIntegrations();
        }
        props.push(RoutePaths.Integrations.replace(':appName', props.selectedProject.name));
    };
    const handleProjectClick = function (project: IProject) {
        if (props.selectedProject?.id !== project.id) {
            props.selectProject(project);
            props.resetGeofences();
            props.resetIntegrations();
        }
        props.push(`${RoutePaths.ProjectsEdit}?name=${project.name}`);
    };

    const { classes, projectsState } = props;
    return (
        <React.Fragment>
            <div className={classes.root}>
                <GridList className={classes.gridList} cols={isMdDown ? (isSmDown ? 1.25 : 2.25) : 2.75}>
                    {projectsState.projects &&
                        projectsState.projects.map((project) => (
                            <GridListTile className={classes.gridListTile} key={project.name}>
                                <Card elevation={3} className={classes.card}>
                                    <CardHeader title={project.name} />
                                    <CardContent classes={{ root: classes.cardContent }}>
                                        <Typography component="p">{project.description ? project.description : ' '}</Typography>
                                    </CardContent>
                                    <CardActions className={classes.buttons}>
                                        <IconButton
                                            onClick={() => {
                                                handleProjectGeofencesClick(project);
                                            }}
                                            aria-label="Project Geofences"
                                        >
                                            <MapMarker color="primary" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                handleProjectIntegrationsClick(project);
                                            }}
                                            aria-label="Project integrations"
                                        >
                                            <ArrowDecision color="primary" />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => {
                                                handleProjectClick(project);
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
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(DashboardProjectSelect)));
