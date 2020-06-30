import RoutePaths from '../../RoutePaths';
import GettingStarted from './GettingStarted';
import IRoute from '../../ILandingRoute';

export const DocComponents: IRoute[] = [
    { exact: true, path: `${RoutePaths.Docs}/getting-started`, component: GettingStarted },
    { exact: true, path: `/getting-started`, component: GettingStarted },
];
