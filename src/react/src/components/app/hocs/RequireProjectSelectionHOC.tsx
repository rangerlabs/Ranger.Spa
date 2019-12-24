import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { push, replace } from 'connected-react-router';
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
    replace: (path: string) => void;
}

class NextRouteResult {
    constructor(replace: boolean, route: string) {
        this.replace = false;
        this.nextPath = route;
    }
    replace: boolean;
    nextPath: string;
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
        replace: (path: string) => dispatch(replace(path)),
    };
};

const requireProjectSelection = <P extends object>(Component: React.ComponentType<P>) => {
    class RequireProjectSelectionComponent extends React.Component<RequireProjectSelectionProps> {
        componentDidMount() {
            const nextPath = this.getNextPathFromCurrentProjectState();
            if (nextPath.replace) {
                this.props.replace(nextPath.nextPath);
            } else {
                if (nextPath.nextPath) {
                    this.props.push(nextPath.nextPath);
                }
                // else the route was valid and the selected project is the store; let the browser handle the navigation
            }
        }

        componentDidUpdate(prevProps: RequireProjectSelectionProps) {
            if (prevProps.projectsState.projects !== this.props.projectsState.projects) {
                const nextPath = this.getNextPathFromCurrentProjectState();
                if (nextPath.replace) {
                    this.props.replace(nextPath.nextPath);
                } else {
                    if (nextPath.nextPath) {
                        this.props.push(nextPath.nextPath);
                    }
                    // else the route was valid and the selected project is the store; let the browser handle the navigation
                }
            }
        }

        getNextPathFromCurrentProjectState(): NextRouteResult {
            const nextRouteResult = new NextRouteResult(false, '');
            if (this.props.projectsState.projects.length > 0) {
                const redirect = window.location.pathname.split('/');
                let requestProjectName = '';
                let redirectComponentPath = '';
                if (redirect.length >= 2 && redirect[1] === ':appName') {
                    redirectComponentPath = window.location.pathname.replace('/:appName', '') + window.location.search;
                    nextRouteResult.replace = true;
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
                } else if (this.projectIsInReduxStateAndIsValid()) {
                    nextRouteResult.nextPath =
                        '/' +
                        this.props.projectsState.projects.filter(a => a.name === this.props.selectedProject.name).map(a => a.name) +
                        redirectComponentPath;
                } else if (this.stateContainsOnlyOneProject()) {
                    this.props.selectProject(this.props.projectsState.projects[0]);
                    nextRouteResult.nextPath = '/' + this.props.projectsState.projects[0].name + redirectComponentPath;
                } else {
                    nextRouteResult.nextPath = `/projects/select?redirect=${redirectComponentPath}`;
                }
            } else {
                nextRouteResult.nextPath = RoutePaths.FirstProjectRequired;
            }
            return nextRouteResult;
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
    return connect<StateProps, DispatchProps, null>(mapStateToProps, mapDispatchToProps)(populateProjectsHOC(RequireProjectSelectionComponent));
};

export default requireProjectSelection;
