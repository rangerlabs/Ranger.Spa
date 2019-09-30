import RestUtilities, { IRestResponse } from './RestUtilities';
import IProject from '../models/app/IProject';
import Logger from './Logger/Logger';

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
}
