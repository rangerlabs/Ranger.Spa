import RestUtilities, { IRestResponse } from "./RestUtilities";
import IUser from "../models/app/IUser";
import Logger from "./Logger/Logger";

export default class UserService {
    async getUsers(): Promise<IRestResponse<IUser[]>> {
        return RestUtilities.get<IUser[]>("/app/user/all");
    }

    async getUser(email: string): Promise<IRestResponse<IUser>> {
        return RestUtilities.get<IUser>("/app/user?email=" + email);
    }

    async postUser(user: IUser): Promise<IRestResponse<IUser>> {
        return RestUtilities.post<IUser>("/app/user", user);
    }
}
