export default interface IProject {
    id: string;
    name: string;
    description: string;
    liveApiKey?: string;
    testApiKey?: string;
    projectApiKey?: string;
    liveApiKeyPrefix: string;
    testApiKeyPrefix: string;
    projectApiKeyPrefix: string;
    enabled: boolean;
    version: number;
}
