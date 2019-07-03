import RestUtilities, { IRestResponse } from "./RestUtilities";
import IApp from "../models/app/IApp";
import Logger from "./Logger/Logger";

export default class AppService {
    async getApps(): Promise<IRestResponse<IApp[]>> {
        return RestUtilities.get<IApp[]>("/app/app/all");
    }

    async getApp(name: string): Promise<IRestResponse<IApp>> {
        return RestUtilities.get<IApp>("/app/app?name=" + name);
    }

    async postApp(app: IApp): Promise<IRestResponse<IApp>> {
        return RestUtilities.post<IApp>("/app/app", app);
    }
}
