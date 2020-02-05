import RestUtilities, { IRestResponse } from './RestUtilities';
import IProject from '../models/app/IProject';

export default class ProjectService {
    async getProjects(): Promise<IRestResponse<IProject[]>> {
        return RestUtilities.get<IProject[]>('/projects');
    }

    async postProject(project: IProject): Promise<IRestResponse<IProject>> {
        return RestUtilities.post<IProject>('/projects', project);
    }

    async putProject(project: IProject, projectId: string): Promise<IRestResponse<IProject>> {
        return RestUtilities.put<IProject>(`/projects/${projectId}`, project);
    }

    async apiKeyReset(project: IProject, projectId: string, environment: string): Promise<IRestResponse<IProject>> {
        return RestUtilities.put<IProject>(`/projects/${projectId}/${environment}/reset`, project);
    }

    async deleteProject(projectId: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`/projects/${projectId}`);
    }
}
