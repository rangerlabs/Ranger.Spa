import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import IProject from '../../../models/app/IProject';
import { selectProject } from '../../../redux/actions/SelecteProjectActions';
import RoutePaths from '../../RoutePaths';
import populateProjectsHOC from './PopulateProjectsHOC';
import { ProjectsState } from '../../../redux/actions/ProjectActions';
import FirstProjectRequired from '../projects/FirstProjectRequired';

type RequireProjectSelectionProps = StateProps & DispatchProps;

interface StateProps {
    projectsState: ProjectsState;
    selectedProject: IProject;
}
interface DispatchProps {
    selectProject: (project: IProject) => void;
    push: (path: string) => void;
}

const mapStateToProps = (state: ApplicationState): StateProps => {
    return {
        selectedProject: state.selectedProject,
        projectsState: state.projectsState,
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        selectProject: (project: IProject) => {
            const action = selectProject(project);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

const requireProjectSelection = <P extends object>(Component: React.ComponentType<P>) => {
    class RequireProjectSelectionComponent extends React.Component<RequireProjectSelectionProps> {
        componentDidMount() {
            const nextPath = this.getNextPathFromCurrentProjectState();
            this.props.push(nextPath);
        }

        componentDidUpdate(prevProps: RequireProjectSelectionProps) {
            if (prevProps.projectsState.projects !== this.props.projectsState.projects) {
                const nextPath = this.getNextPathFromCurrentProjectState();
                this.props.push(nextPath);
            }
        }

        getNextPathFromCurrentProjectState(): string {
            let pushPath = '';
            if (this.props.projectsState.projects.length > 0) {
                const redirect = window.location.pathname.split('/');
                let requestProjectName = '';
                let redirectComponentPath = '';
                if (redirect.length >= 2 && redirect[1] === ':appName') {
                    redirectComponentPath = window.location.pathname.replace('/:appName', '') + window.location.search;
                } else if (redirect.length >= 2) {
                    requestProjectName = redirect[1];
                    redirect.forEach((v, i) => {
                        if (i >= 2) {
                            redirectComponentPath += '/' + v;
                        }
                    });
                    redirectComponentPath += window.location.search;
                } else {
                    redirectComponentPath = RoutePaths.Dashboard;
                }

                const requestProject = this.props.projectsState.projects.filter(p => p.name === requestProjectName);
                if (requestProject && requestProject.length === 1) {
                    this.props.selectProject(requestProject[0]);
                    pushPath = '/' + requestProjectName + redirectComponentPath;
                } else if (this.projectIsInReduxStateAndIsValid()) {
                    pushPath =
                        '/' +
                        this.props.projectsState.projects.filter(a => a.name === this.props.selectedProject.name).map(a => a.name) +
                        redirectComponentPath;
                } else if (this.stateContainsOnlyOneProject()) {
                    this.props.selectProject(this.props.projectsState.projects[0]);
                    pushPath = '/' + this.props.projectsState.projects[0].name + redirectComponentPath;
                } else {
                    pushPath = `/projects/select?redirect=${redirectComponentPath}`;
                }
            } else {
                pushPath = RoutePaths.FirstProjectRequired;
            }
            return pushPath;
        }

        private stateContainsOnlyOneProject() {
            return this.props.projectsState.projects.length === 1;
        }

        private projectIsInReduxStateAndIsValid() {
            return this.props.selectedProject && this.props.projectsState.projects.map(p => p.name).indexOf(this.props.selectedProject.name) >= 0;
        }

        render() {
            return this.props.selectedProject ? <Component {...(this.props as P)} /> : null;
        }
    }
    return connect<StateProps, DispatchProps, null>(
        mapStateToProps,
        mapDispatchToProps
    )(populateProjectsHOC(RequireProjectSelectionComponent));
};

export default requireProjectSelection;
