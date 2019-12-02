import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { populateProjects, ProjectsState } from '../../../redux/actions/ProjectActions';
import ProjectService from '../../../services/ProjectService';
import Loading from '../loading/Loading';

const projectService = new ProjectService();

interface PopulateProjectsComponentProps {
    setProjects: (projects: IProject[]) => void;
    selectedProject: IProject;
    projectsState: ProjectsState;
}

const mapStateToProps = (state: ApplicationState) => {
    return { projectsState: state.projectsState, selectedProject: state.selectedProject };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setProjects: (projects: IProject[]) => {
            const action = populateProjects(projects);
            dispatch(action);
        },
    };
};

const populateProjectsHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateProjectsComponent extends React.Component<PopulateProjectsComponentProps> {
        componentDidMount() {
            if (!this.props.projectsState.isLoaded) {
                projectService.getProjects().then(projectResponse => {
                    setTimeout(() => {
                        this.props.setProjects(projectResponse.content);
                    }, 250);
                });
            }
        }

        render() {
            return this.props.projectsState.isLoaded ? <Component {...(this.props as P)} /> : <Loading message="Retrieving projects." />;
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(PopulateProjectsComponent);
};

export default populateProjectsHOC;
