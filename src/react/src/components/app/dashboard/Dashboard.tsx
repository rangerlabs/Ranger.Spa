import * as React from 'react';
import DashboardProjectSelect from './DashboardProjectSelect';
import { Typography, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import IProject from '../../../models/app/IProject';

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            margin: theme.spacing(2),
        },
    });

interface DashboardProps extends WithStyles<typeof styles> {
    projects: IProject[];
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        projects: state.projects,
    };
};

class Dashboard extends React.Component<DashboardProps> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.layout}>
                {this.props.projects.length === 0 ? null : (
                    <React.Fragment>
                        <DashboardProjectSelect />
                    </React.Fragment>
                )}
                <Typography align="left" variant="subtitle1">
                    Usage
                </Typography>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(Dashboard));
