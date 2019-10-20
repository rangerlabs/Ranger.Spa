import * as React from 'react';
import DashboardProjectSelect from './DashboardProjectSelect';
import { Typography, createStyles, Theme, withStyles, WithStyles, LinearProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { ProjectsState } from '../../../redux/actions/ProjectActions';

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
                    <Typography align="left" variant="subtitle1">
                        Projects
                    </Typography>
                    <DashboardProjectSelect />
                </React.Fragment>
                <Typography align="left" variant="subtitle1">
                    Usage
                </Typography>
                <LinearProgress color="primary" variant="query" />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(Dashboard));
