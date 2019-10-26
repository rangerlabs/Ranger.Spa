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

interface ProjectsProps {
    projectsState: ProjectsState;
    addProject: (project: IProject) => void;
    removeProject: (name: string) => void;
    push: typeof push;
}

const mapStateToProps = (state: ApplicationState) => {
    return { projectsState: state.projectsState };
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
        this.props.push(`${RoutePaths.ProjectsEdit}?name=${rowData[0]}`);
    };

    redirectToNewProjectForm = () => {
        this.props.push(RoutePaths.ProjectsNew);
    };

    mapProjectsToTableProjects(projects: IProject[]): Array<Array<string>> {
        const tableProjects = new Array<Array<string>>();
        if (projects) {
            projects.forEach(value => {
                tableProjects.push([value.name, value.description, `${value.liveApiKeyPrefix}...`, `${value.testApiKeyPrefix}...`]);
            });
        }
        return tableProjects;
    }

    columns = [
        {
            name: 'Name',
            options: {
                filter: true,
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
        print: false,
        download: false,
        customToolbar: () => {
            return <CustomAddToolbar toggleFormFlag={this.redirectToNewProjectForm} />;
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(populateProjectsHOC(Projects));
