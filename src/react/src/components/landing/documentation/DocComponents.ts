import GettingStarted from './GettingStarted';
import ProjectsAndRolesDoc from './ProjectsAndRolesDoc';
import IDocComponent from './IDocComponent';
import GeofencesDoc from './GeofencesDoc';
import IntegrationsDoc from './IntegrationsDocs/IntegrationsDoc';
import BreadcrumbsDoc from './BreadcrumbsDoc';

export const DocComponents: IDocComponent[] = [
    { name: 'getting-started', component: GettingStarted },
    { name: 'projects-and-roles', component: ProjectsAndRolesDoc },
    { name: 'geofences', component: GeofencesDoc },
    { name: 'integrations', component: IntegrationsDoc },
    { name: 'breadcrumbs', component: BreadcrumbsDoc },
];
