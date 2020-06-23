import * as React from 'react';
import DashboardProjectSelect from './DashboardProjectSelect';
import { Typography, createStyles, Theme, withStyles, WithStyles, LinearProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { ProjectsState } from '../../../redux/actions/ProjectActions';
import FirstProjectRequired from '../projects/FirstProjectRequired';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            margin: theme.spacing(2),
        },
    });

interface DashboardProps extends WithStyles<typeof styles> {
    projectsState: ProjectsState;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        projectsState: state.projectsState,
    };
};

class Dashboard extends React.Component<DashboardProps> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.layout}>
                <React.Fragment>
                    {this.props.projectsState.projects.length !== 0 ? (
                        <React.Fragment>
                            <Typography align="left" variant="subtitle1">
                                Projects
                            </Typography>
                            <DashboardProjectSelect />
                        </React.Fragment>
                    ) : (
                        <FirstProjectRequired showWelcomeMessage />
                    )}
                </React.Fragment>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(populateProjectsHOC(Dashboard)));
