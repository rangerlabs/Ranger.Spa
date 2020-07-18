import GettingStarted from './GettingStarted';
import ProjectsAndRolesDoc from './ProjectsAndRolesDoc';
import IDocComponent from './IDocComponent';
import GeofencesDoc from './GeofencesDoc';
import IntegrationsDoc from './IntegrationsDocs/IntegrationsDoc';
import BreadcrumbsDoc from './BreadcrumbsDoc';
import DocRoutePaths from './DocRoutePaths';

export const DocComponents: IDocComponent[] = [
    { path: DocRoutePaths.GettingStarted, component: GettingStarted },
    { path: DocRoutePaths.ProjectsAndRoles, component: ProjectsAndRolesDoc },
    { path: DocRoutePaths.Geofences, component: GeofencesDoc },
    { path: DocRoutePaths.Integrations, component: IntegrationsDoc },
    { path: DocRoutePaths.Breadcrumbs, component: BreadcrumbsDoc },
];
