import * as React from 'react';
import IProject from '../../../models/app/IProject';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addProject, removeProject, ProjectsState } from '../../../redux/actions/ProjectActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import { User } from 'oidc-client';
import { userIsInRole } from '../../../helpers/Helpers';
import { RoleEnum } from '../../../models/RoleEnum';
import { Grid, Theme, createStyles, withStyles, WithStyles, TableFooter } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
const MUIDataTable = require('mui-datatables').default;

const styles = (theme: Theme) =>
    createStyles({
        grid: {
            padding: theme.spacing(2),
        },
        footer: {
            display: 'block',
            height: '54px',
        },
        tableIcon: {
            paddingRight: theme.spacing(1),
            verticalAlign: 'inherit',
        },
    });

interface ProjectsProps extends WithStyles<typeof styles> {
    projectsState: ProjectsState;
    addProject: (project: IProject) => void;
    removeProject: (name: string) => void;
    push: typeof push;
    user: User;
}

const mapStateToProps = (state: ApplicationState) => {
    return { projectsState: state.projectsState, user: state.oidc.user };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addProject: (project: IProject) => {
            const action = addProject(project);
            dispatch(action);
        },
        removeProject: (name: string) => {
            const action = removeProject(name);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class Projects extends React.Component<ProjectsProps> {
    refs: {
        query: HTMLInputElement;
    };

    editProject = (rowData: string[]) => {
        this.props.push(`${RoutePaths.ProjectsEdit}?name=${rowData[1]}`);
    };

    redirectToNewProjectForm = () => {
        this.props.push(RoutePaths.ProjectsNew);
    };

    mapProjectsToTableProjects(projects: IProject[]): Array<Array<string>> {
        const tableProjects = new Array<Array<string>>();
        if (projects) {
            projects.forEach((value) => {
                tableProjects.push([
                    value.enabled ? 'Enabled' : 'Disabled',
                    value.name,
                    value.description,
                    `${value.liveApiKeyPrefix}...`,
                    `${value.testApiKeyPrefix}...`,
                ]);
            });
        }
        return tableProjects;
    }

    booleanRender = (value: string, trueValue: string): JSX.Element => {
        return value === trueValue ? (
            <React.Fragment>
                <CheckCircleOutlineIcon fontSize="small" className={this.props.classes.tableIcon} color="primary" />
                {value}
            </React.Fragment>
        ) : (
            <React.Fragment>
                <HighlightOffIcon fontSize="small" className={this.props.classes.tableIcon} color="error" />
                {value}
            </React.Fragment>
        );
    };

    columns = [
        {
            name: 'Enabled',
            options: {
                filter: true,
                customBodyRender: (value: string) => {
                    return this.booleanRender(value, 'Enabled');
                },
            },
        },
        {
            name: 'Name',
            options: {
                filter: false,
            },
        },
        {
            name: 'Description',
            options: {
                filter: false,
            },
        },
        {
            name: 'Live API Key Prefix',
            options: {
                filter: false,
            },
        },
        {
            name: 'Test API Key Prefix',
            options: {
                filter: false,
            },
        },
    ];
    options = {
        textLabels: {
            body: {
                noMatch: 'Your organization has not created any projects yet.',
            },
        },
        filterType: 'multiSelect',
        print: false,
        download: false,
        customToolbar: () => {
            return Boolean(userIsInRole(this.props.user, RoleEnum.ADMIN)) ? <CustomAddToolbar toggleFormFlag={this.redirectToNewProjectForm} /> : null;
        },
        customFooter: this.props.projectsState.projects?.length > 10 ? null : () => <TableFooter className={this.props.classes.footer} />,
        elevation: 3,
        selectableRows: 'none',
        responsive: 'stacked',
        viewColumns: false,
        onRowClick: this.editProject,
    };

    render() {
        const { classes, projectsState } = this.props;
        return (
            <Grid className={classes.grid} container justify="center" alignItems="center">
                <Grid item xs={12}>
                    <MUIDataTable
                        title={'Projects'}
                        data={this.mapProjectsToTableProjects(projectsState.projects)}
                        columns={this.columns}
                        options={this.options}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateProjectsHOC(Projects)));
