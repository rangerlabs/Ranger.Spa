import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../stores";
import { push } from "connected-react-router";
import IApp from "../../../models/app/IApp";
import { selectApp } from "../../../redux/actions/SelectedAppActions";
import RoutePaths from "../../RoutePaths";

type RequireAppSelectionProps = StateProps & DispatchProps;

interface StateProps {
    apps: IApp[];
    selectedApp: string;
}
interface DispatchProps {
    selectApp: (appName: string) => void;
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
        selectApp: (appName: string) => {
            const action = selectApp(appName);
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
                const redirect = window.location.pathname.split("/");
                let appName = "";
                let redirectComponentPath = "";
                if (redirect.length >= 2 && redirect[1] === ":appName") {
                    redirectComponentPath = window.location.pathname.replace("/:appName", "") + window.location.search;
                } else if (redirect.length >= 2) {
                    appName = redirect[1];
                    redirect.forEach((v, i) => {
                        if (i >= 2) {
                            redirectComponentPath += "/" + v;
                        }
                    });
                    redirectComponentPath += window.location.search;
                } else {
                    redirectComponentPath = RoutePaths.Dashboard;
                }

                let pushPath = undefined as string;
                if (this.appIsInUrlAndIsValid(appName)) {
                    this.props.selectApp(appName);
                    pushPath = "/" + appName + redirectComponentPath;
                } else if (this.appIsInStateAndIsValid()) {
                    pushPath = "/" + this.props.selectedApp + redirectComponentPath;
                } else if (this.stateContainsOnlyOneApp()) {
                    this.props.selectApp(this.props.apps[0].name);
                    pushPath = "/" + this.props.apps[0].name + redirectComponentPath;
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
            return this.props.selectedApp && this.props.apps.map(a => a.name).indexOf(this.props.selectedApp) >= 0;
        }

        render() {
            return this.props.selectedApp ? <Component {...this.props as P} /> : null;
        }
    }
    return connect<StateProps, DispatchProps, null>(
        mapStateToProps,
        mapDispatchToProps
    )(RequireAppSelectionComponent);
};

export default requireAppSelection;
