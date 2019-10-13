import RestUtilities, { IRestResponse } from './RestUtilities';
import IProject from '../models/app/IProject';

export default class ProjectService {
    async getProjects(): Promise<IRestResponse<IProject[]>> {
        return RestUtilities.get<IProject[]>('/project/all');
    }

    async getProject(name: string): Promise<IRestResponse<IProject>> {
        return RestUtilities.get<IProject>('/project?name=' + name);
    }

    async postProject(project: IProject): Promise<IRestResponse<IProject>> {
        return RestUtilities.post<IProject>('/project', project);
    }

    async putProject(project: IProject, projectId: string): Promise<IRestResponse<IProject>> {
        return RestUtilities.put<IProject>(`/project/${projectId}`, project);
    }
}
