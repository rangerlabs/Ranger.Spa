import GettingStarted from './GettingStarted';
import IRoute from '../../ILandingRoute';
import ProjectsDoc from './ProjectsDoc';

export const DocComponents: IRoute[] = [
    { exact: true, path: '/', component: GettingStarted },
    { exact: true, path: 'getting-started', component: GettingStarted },
    { exact: true, path: 'projects', component: ProjectsDoc },
];
