import * as React from 'react';
import IProject from '../../../models/app/IProject';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addProject, removeProject, ProjectsState } from '../../../redux/actions/ProjectActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
const MUIDataTable = require('mui-datatables').default;
import populateProjectsHOC from '../hocs/PopulateProjectsHOC';
import { User } from 'oidc-client';
import { userIsInRole } from '../../../helpers/Helpers';
import { RoleEnum } from '../../../models/RoleEnum';

interface ProjectsProps {
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
            projects.forEach(value => {
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

    columns = [
        {
            name: 'Enabled',
            options: {
                filter: true,
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
            name: 'Live Api Key Prefix',
            options: {
                filter: false,
            },
        },
        {
            name: 'Test Api Key Prefix',
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
        print: false,
        download: false,
        customToolbar: () => {
            return Boolean(userIsInRole(this.props.user, RoleEnum.ADMIN)) ? <CustomAddToolbar toggleFormFlag={this.redirectToNewProjectForm} /> : null;
        },
        elevation: 0,
        selectableRows: 'none',
        responsive: 'stacked',
        viewColumns: false,
        onRowClick: this.editProject,
    };

    render() {
        const { projectsState } = this.props;
        return (
            <React.Fragment>
                <MUIDataTable title={'Projects'} data={this.mapProjectsToTableProjects(projectsState.projects)} columns={this.columns} options={this.options} />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(populateProjectsHOC(Projects));
