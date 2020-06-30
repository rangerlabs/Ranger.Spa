import RoutePaths from '../../RoutePaths';
import GettingStarted from './GettingStarted';
import IRoute from '../../ILandingRoute';

export const DocComponents: IRoute[] = [{ exact: true, path: `/getting-started`, component: GettingStarted }];
