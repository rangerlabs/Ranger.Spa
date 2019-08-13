import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../stores";
import UserManager from "../../../services/UserManager";
import TenantService from "../../../services/TenantService";
import { push } from "connected-react-router";
import RoutePaths from "../../RoutePaths";

const tenantService = new TenantService();

type AuthorizedRouteProps = StateProps & DispatchProps & OwnProps;

interface AuthorizedRouteState {
    isAuthorized: boolean;
}

interface StateProps {
    user: Oidc.User;
    isLoadingUser: boolean;
}

interface DispatchProps {
    push: (path: string) => void;
}

interface OwnProps {
    path?: string | string[];
}

const mapStateToProps = (state: ApplicationState): StateProps => {
    return {
        user: state.oidc.user,
        isLoadingUser: state.oidc.isLoadingUser,
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        push: (path: string) => dispatch(push(path)),
    };
};

const authorizedRoute = <P extends object>(Component: React.ComponentType<P>) => {
    class AuthorizedRouteComponent extends React.Component<AuthorizedRouteProps, AuthorizedRouteState> {
        state: AuthorizedRouteState = {
            isAuthorized: false,
        };
        componentWillMount() {
            this.checkUserIsAuthorized();
        }

        componentDidUpdate(prevProps: AuthorizedRouteProps) {
            if (prevProps.user !== this.props.user || prevProps.isLoadingUser !== this.props.isLoadingUser || prevProps.path !== this.props.path) {
                this.checkUserIsAuthorized();
            }
        }

        checkUserIsAuthorized() {
            if (!this.props.isLoadingUser) {
                const domains = window.location.hostname.split(".");
                if (this.props.user && !this.props.user.expired) {
                    this.setState({ isAuthorized: true });
                } else if ((!this.props.user || this.props.user.expired) && domains.length === 3) {
                    tenantService.exists(domains[0]).then(v => {
                        if (v) {
                            UserManager.signinRedirect({ data: { path: this.props.path } });
                        }
                    });
                } else {
                    this.props.push(RoutePaths.Landing);
                }
            }
        }

        render() {
            return this.state.isAuthorized ? <Component {...this.props as P} /> : null;
        }
    }
    return connect<StateProps, DispatchProps, OwnProps>(
        mapStateToProps,
        mapDispatchToProps
    )(AuthorizedRouteComponent);
};

export default authorizedRoute;
