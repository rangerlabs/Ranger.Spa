import GettingStarted from './GettingStarted';
import ProjectsAndRolesDoc from './ProjectsAndRolesDoc';
import IDocComponent from './IDocComponent';
import GeofencesDoc from './GeofencesDoc';
import IntegrationsDoc, { IntegrationsDocOutline } from './IntegrationsDocs/IntegrationsDoc';
import BreadcrumbsDoc from './BreadcrumbsDoc';
import DocRoutePaths from './DocRoutePaths';

export const DocComponents: IDocComponent[] = [
    { name: 'Getting Started', path: DocRoutePaths.GettingStarted, component: GettingStarted, outline: IntegrationsDocOutline },
    { name: 'Projects and Roles', path: DocRoutePaths.ProjectsAndRoles, component: ProjectsAndRolesDoc, outline: IntegrationsDocOutline },
    { name: 'Geofences', path: DocRoutePaths.Geofences, component: GeofencesDoc, outline: IntegrationsDocOutline },
    { name: 'Integrations', path: DocRoutePaths.Integrations, component: IntegrationsDoc, outline: IntegrationsDocOutline },
    { name: 'Breadcrumbs', path: DocRoutePaths.Breadcrumbs, component: BreadcrumbsDoc, outline: IntegrationsDocOutline },
];
