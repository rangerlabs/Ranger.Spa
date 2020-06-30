import GettingStarted from './GettingStarted';
import IRoute from '../../ILandingRoute';

export const DocComponents: IRoute[] = [
    { exact: true, path: `/`, component: GettingStarted },
    { exact: true, path: `getting-started`, component: GettingStarted },
];
