export default interface IProject {
    projectId: string;
    name: string;
    description: string;
    liveApiKey?: string;
    testApiKey?: string;
    liveApiKeyPrefix: string;
    testApiKeyPrefix: string;
    enabled: boolean;
    version: number;
}
