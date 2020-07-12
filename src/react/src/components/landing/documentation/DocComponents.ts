import GettingStarted from './GettingStarted';
import ProjectsDoc from './ProjectsDoc';
import IDocComponent from './IDocComponent';
import GeofencesDoc from './GeofencesDoc';
import IntegrationsDoc from './IntegrationsDocs/IntegrationsDoc';

export const DocComponents: IDocComponent[] = [
    { name: 'getting-started', component: GettingStarted },
    { name: 'projects', component: ProjectsDoc },
    { name: 'geofences', component: GeofencesDoc },
    { name: 'integrations', component: IntegrationsDoc },
];
