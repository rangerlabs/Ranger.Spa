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
    CardMedia,
    CardActions,
    IconButton,
    GridList,
    GridListTile,
    Paper,
} from '@material-ui/core';
import ArrowRight from 'mdi-material-ui/ArrowRight';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
const IntegrationApi = require('../../../../assets/integration-api.png');
import { ProjectsState } from '../../../redux/actions/ProjectActions';

const styles = (theme: Theme) =>
    createStyles({
        card: {
            // height: "100%",
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
    selectProject: (project: IProject) => void;
    push: typeof push;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        projectsState: state.projectsState,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        selectProject: (project: IProject) => {
            const action = selectProject(project);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class DashboardProjectSelect extends React.Component<ProjectsSelectProps> {
    handleProjectClick(project: IProject) {
        this.props.selectProject(project);
        this.props.push(RoutePaths.GeofenceMap);
    }
    render() {
        const { classes, projectsState } = this.props;
        return (
            <React.Fragment>
                <div className={classes.root}>
                    <GridList className={classes.gridList} cols={2.5}>
                        {projectsState.projects.map(project => (
                            <GridListTile className={classes.gridListTile} key={project.name}>
                                <Card className={classes.card}>
                                    <CardHeader title={project.name} />
                                    <CardMedia classes={{ root: classes.mediaRoot }} className={classes.media} image={IntegrationApi} title="Api Integration" />
                                    <CardContent classes={{ root: classes.cardContent }}>
                                        <Typography component="p">{project.description}</Typography>
                                    </CardContent>
                                    <CardActions className={classes.buttons}>
                                        <IconButton
                                            onClick={() => {
                                                this.handleProjectClick(project);
                                            }}
                                            aria-label="Select app"
                                        >
                                            <ArrowRight color="primary" />
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(DashboardProjectSelect));
