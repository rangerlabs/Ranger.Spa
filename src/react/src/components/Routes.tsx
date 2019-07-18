import * as React from "react";
import * as OIDC from "oidc-client";
import { Switch, RouteComponentProps, Route } from "react-router-dom";
import { ApplicationState } from "../stores/index";
import { connect } from "react-redux";
import { hot } from "react-hot-loader";
import RoutePaths from "./RoutePaths";
import UserManager from "../services/UserManager";
import NotFound from "../components/error/NotFound";
import AppLayout from "./app/AppLayout";
import LandingLayout from "./landing/LandingLayout";
import IAppRoute from "./IAppRoute";
import { WhiteListedComponents } from "./WhiteListedComponents";
import { AuthorizedComponents } from "./AuthorizedComponents";
import Callback from "./auth/Callback";
import TenantService from "../services/TenantService";

const tenantService = new TenantService();

interface RoutesProps {
    user: OIDC.User;
    isLoadingUser: boolean;
    pathname: string;
}

class Routes extends React.Component<RoutesProps & RouteComponentProps<{}>> {
    render() {
        const { user, location, pathname } = this.props;
        let isLoading = true;
        if (location && !this.props.isLoadingUser) {
            const whiteListedRoutes = WhiteListedComponents;
            const domains = window.location.hostname.split(".");
            let authorizedRoutes: IAppRoute[] = [];

            if (pathname !== RoutePaths.Callback && pathname !== RoutePaths.Login && (!user || user.expired) && domains.length === 3) {
                tenantService.exists(domains[0]).then(values => {
                    if (values.content) {
                        UserManager.signinRedirect({ data: { path: pathname } });
                    }
                });
            } else if (user && !user.expired) {
                authorizedRoutes = AuthorizedComponents;
                isLoading = false;
            } else {
                isLoading = false;
            }

            return isLoading ? (
                <Route exact={true} path={RoutePaths.Callback} component={Callback} />
            ) : (
                <Switch>
                    {whiteListedRoutes.map((props, index) => (
                        <LandingLayout key={index} {...props} />
                    ))}
                    {authorizedRoutes.map((props, index) => (
                        <AppLayout key={index} breadcrumbPath={props.breadcrumbPath} {...props} />
                    ))}
                    <Route exact={true} path={RoutePaths.Callback} component={Callback} />
                    <Route component={NotFound} />
                </Switch>
            );
        }

        return (
            <Switch>
                <Route exact={true} path={RoutePaths.Callback} component={Callback} />
            </Switch>
        );
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        user: state.oidc.user,
        isLoadingUser: state.oidc.isLoadingUser,
        pathname: state.router.location.pathname,
    };
}

export default connect(mapStateToProps)(hot(module)(Routes));
