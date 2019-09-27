import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../stores';
import { push } from 'connected-react-router';
import IApp from '../../../models/app/IApp';
import { selectApp } from '../../../redux/actions/SelectedAppActions';
import RoutePaths from '../../RoutePaths';

type RequireAppSelectionProps = StateProps & DispatchProps;

interface StateProps {
    apps: IApp[];
    selectedApp: IApp;
}
interface DispatchProps {
    selectApp: (app: IApp) => void;
    push: (path: string) => void;
}

const mapStateToProps = (state: ApplicationState): StateProps => {
    return {
        selectedApp: state.selectedApp,
        apps: state.apps,
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        selectApp: (app: IApp) => {
            const action = selectApp(app);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

const requireAppSelection = <P extends object>(Component: React.ComponentType<P>) => {
    class RequireAppSelectionComponent extends React.Component<RequireAppSelectionProps> {
        UNSAFE_componentWillMount() {
            this.checkAppIsSelected();
        }

        componentDidUpdate(prevProps: RequireAppSelectionProps) {
            if (prevProps.apps !== this.props.apps) {
                this.checkAppIsSelected();
            }
        }

        checkAppIsSelected() {
            if (this.props.apps.length > 0) {
                const redirect = window.location.pathname.split('/');
                let appName = '';
                let redirectComponentPath = '';
                if (redirect.length >= 2 && redirect[1] === ':appName') {
                    redirectComponentPath = window.location.pathname.replace('/:appName', '') + window.location.search;
                } else if (redirect.length >= 2) {
                    appName = redirect[1];
                    redirect.forEach((v, i) => {
                        if (i >= 2) {
                            redirectComponentPath += '/' + v;
                        }
                    });
                    redirectComponentPath += window.location.search;
                } else {
                    redirectComponentPath = RoutePaths.Dashboard;
                }

                let pushPath = undefined as string;
                const app = this.props.apps.filter(a => a.name === appName);
                if (app && app.length === 1) {
                    this.props.selectApp(app[0]);
                    pushPath = '/' + appName + redirectComponentPath;
                } else if (this.appIsInStateAndIsValid()) {
                    pushPath = '/' + this.props.apps.filter(a => a.id === this.props.selectedApp.id).map(a => a.name) + redirectComponentPath;
                } else if (this.stateContainsOnlyOneApp()) {
                    this.props.selectApp(this.props.apps[0]);
                    pushPath = '/' + this.props.apps[0].id + redirectComponentPath;
                } else {
                    pushPath = `/apps/select?redirect=${redirectComponentPath}`;
                }
                this.props.push(pushPath);
            }
        }

        private stateContainsOnlyOneApp() {
            return this.props.apps.length === 1;
        }

        private appIsInUrlAndIsValid(appName: string) {
            return appName && this.props.apps.map(a => a.name).indexOf(appName) >= 0;
        }

        private appIsInStateAndIsValid() {
            return this.props.selectedApp && this.props.apps.map(a => a.id).indexOf(this.props.selectedApp.id) >= 0;
        }

        render() {
            return this.props.selectedApp ? <Component {...(this.props as P)} /> : null;
        }
    }
    return connect<StateProps, DispatchProps, null>(
        mapStateToProps,
        mapDispatchToProps
    )(RequireAppSelectionComponent);
};

export default requireAppSelection;
