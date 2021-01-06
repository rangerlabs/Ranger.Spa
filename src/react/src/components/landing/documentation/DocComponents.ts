import GettingStarted, { GettingStartedDocOutline } from './GettingStarted';
import ProjectsAndRolesDoc, { ProjectsAndRolesDocOutline } from './ProjectsAndRolesDoc';
import IDocComponent from './IDocComponent';
import GeofencesDoc, { GeofencesDocOutline } from './GeofencesDoc';
import IntegrationsDoc, { IntegrationsDocOutline } from './integrationDocs/IntegrationsDoc';
import BreadcrumbsDoc, { BreadcrumbsDocOutline } from './BreadcrumbsDoc';
import DocRoutePaths from './DocRoutePaths';
import SubscriptionDoc, { SubscriptionDocOutline } from './SubscriptionDoc';
import ApiDoc, { ApiDocOutline } from './apiDocs/ApiDoc';
import SdksDoc, { SdksDocOutline } from './sdkDocs/SdksDoc';

export const DocComponents: IDocComponent[] = [
	{ name: 'Getting Started', path: DocRoutePaths.GettingStarted, component: GettingStarted, outline: GettingStartedDocOutline },
	{ name: 'Projects and Roles', path: DocRoutePaths.ProjectsAndRoles, component: ProjectsAndRolesDoc, outline: ProjectsAndRolesDocOutline },
	{ name: 'Geofences', path: DocRoutePaths.Geofences, component: GeofencesDoc, outline: GeofencesDocOutline },
	{ name: 'Integrations', path: DocRoutePaths.Integrations, component: IntegrationsDoc, outline: IntegrationsDocOutline },
	{ name: 'Breadcrumbs', path: DocRoutePaths.Breadcrumbs, component: BreadcrumbsDoc, outline: BreadcrumbsDocOutline },
	{ name: 'Subscription', path: DocRoutePaths.Subscription, component: SubscriptionDoc, outline: SubscriptionDocOutline },
	{ name: 'API', path: DocRoutePaths.Api, component: ApiDoc, outline: ApiDocOutline },
	{ name: 'SDKs', path: DocRoutePaths.Sdks, component: SdksDoc, outline: SdksDocOutline },
];
