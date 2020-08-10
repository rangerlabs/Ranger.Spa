import GettingStarted, { GettingStartedDocOutline } from './GettingStarted';
import ProjectsAndRolesDoc, { ProjectsAndRolesDocOutline } from './ProjectsAndRolesDoc';
import IDocComponent from './IDocComponent';
import GeofencesDoc, { GeofencesDocOutline } from './GeofencesDoc';
import IntegrationsDoc, { IntegrationsDocOutline } from './integrationsDocs/IntegrationsDoc';
import BreadcrumbsDoc, { BreadcrumbsDocOutline } from './BreadcrumbsDoc';
import DocRoutePaths from './DocRoutePaths';

export const DocComponents: IDocComponent[] = [
    { name: 'Getting Started', path: DocRoutePaths.GettingStarted, component: GettingStarted, outline: GettingStartedDocOutline },
    { name: 'Projects and Roles', path: DocRoutePaths.ProjectsAndRoles, component: ProjectsAndRolesDoc, outline: ProjectsAndRolesDocOutline },
    { name: 'Geofences', path: DocRoutePaths.Geofences, component: GeofencesDoc, outline: GeofencesDocOutline },
    { name: 'Integrations', path: DocRoutePaths.Integrations, component: IntegrationsDoc, outline: IntegrationsDocOutline },
    { name: 'Breadcrumbs', path: DocRoutePaths.Breadcrumbs, component: BreadcrumbsDoc, outline: BreadcrumbsDocOutline },
];
