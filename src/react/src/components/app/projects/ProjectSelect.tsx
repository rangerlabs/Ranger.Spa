import * as React from 'react';
import { selectProject } from '../../../redux/actions/SelecteProjectActions';
import { Theme, createStyles, WithStyles, withStyles, Card, CardHeader, CardContent, Typography, CardMedia, Grid, ButtonBase } from '@material-ui/core';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
const IntegrationApi = require('../../../../assets/integration-api.png');
import * as queryString from 'query-string';
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import { ProjectsState } from '../../../redux/actions/ProjectActions';
import { resetGeofences } from '../../../redux/actions/GeofenceActions';
import { resetIntegrations } from '../../../redux/actions/IntegrationActions';

const styles = (theme: Theme) =>
    createStyles({
        card: {
            flexGrow: 1,
            height: '100%',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 0,
        },
        media: {
            height: 0,
            paddingTop: '96px',
        },
        layout: {
            margin: theme.spacing(2),
        },
        parallaxContainer: {
            position: 'absolute',
            [theme.breakpoints.up('md')]: {
                width: `calc(100% - ${theme.drawer.width}px - ${theme.spacing(4)}px)`,
            },
            height: '100%',
            width: '100%',
        },
        mediaRoot: {
            backgroundSize: 'contain',
        },
        rootPadding: {
            padding: theme.spacing(1),
        },
        gridButton: {
            width: '100% !important',
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
            dispatch(resetGeofences());
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
        this.props.projectsState.projects.filter(a => a.name === project.name);
        if (this.props.selectedProject?.projectId !== project.projectId) {
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
                <div className={classes.layout}>
                    <Typography gutterBottom variant="h5" align="center">
                        Which project would you like to view?
                    </Typography>
                    <div className={classes.parallaxContainer}>
                        <Parallax pages={2} scrolling={true}>
                            <ParallaxLayer speed={0.7}>
                                <Grid container spacing={3} direction="row" justify="center" alignItems="baseline">
                                    {projectsState.projects.map(project => (
                                        <Grid key={project.name} item xs={12} sm={8} md={7}>
                                            <ButtonBase
                                                className={classes.gridButton}
                                                onClick={() => {
                                                    this.handleProjectClick(project);
                                                }}
                                            >
                                                <Card elevation={3} className={classes.card}>
                                                    <CardHeader
                                                        titleTypographyProps={{ align: 'left' }}
                                                        classes={{ root: classes.rootPadding }}
                                                        title={project.name}
                                                    />
                                                    <CardMedia
                                                        classes={{ root: classes.mediaRoot }}
                                                        className={classes.media}
                                                        image={IntegrationApi}
                                                        title="Api Integration"
                                                    />
                                                    <CardContent classes={{ root: classes.rootPadding }}>
                                                        <Typography align="left" component="p">
                                                            {project.description}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </ButtonBase>
                                        </Grid>
                                    ))}
                                </Grid>
                            </ParallaxLayer>
                        </Parallax>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(ProjectSelect)));
