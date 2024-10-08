import * as React from 'react';
import { Switch, RouteComponentProps, Route } from 'react-router-dom';
import RoutePaths from './RoutePaths';
import NotFound from '../components/error/NotFound';
import AppLayout from './app/AppLayout';
import LandingLayout from './landing/LandingLayout';
import { WhiteListedComponents } from './WhiteListedComponents';
import { AuthorizedComponents } from './AuthorizedComponents';
import Callback from './auth/Callback';

class Routes extends React.Component<RouteComponentProps<{}>> {
    render() {
        const whiteListedRoutes = WhiteListedComponents;
        const authorizedRoutes = AuthorizedComponents;
        return (
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
}

export default Routes;
