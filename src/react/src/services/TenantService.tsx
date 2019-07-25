import RestUtilities, { IRestResponse } from "./RestUtilities";
import Logger from "./Logger/Logger";
import IReviewForm from "../models/landing/IReviewForm";

export default class TenantService {
    async exists(domain: string): Promise<IRestResponse<boolean>> {
        return RestUtilities.get<boolean>("/tenant/exists?domain=" + domain);
    }

    async post(reviewForm: IReviewForm): Promise<boolean> {
        let result = false;
        RestUtilities.post("/tenant", reviewForm).then(value => {
            result = !value.is_error;
        });
        return result;
    }
}
