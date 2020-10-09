import WebhookIntegration from './implementations/WebhookIntegration';
import PusherIntegration from './implementations/PusherIntegration';

export type MergedIntegrationType = WebhookIntegration | PusherIntegration;
