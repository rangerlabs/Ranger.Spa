import RestUtilities from "./RestUtilities";
import IReviewForm from "../models/landing/IReviewForm";
import ReduxStore from "../ReduxStore";
import { enqueueSnackbar, SnackbarNotification } from "../redux/actions/SnackbarActions";

export default class TenantService {
    async exists(domain: string): Promise<boolean> {
        return RestUtilities.get("/tenant/" + domain + "/exists").then(value => {
            if (value.is_error) {
                return false;
            }
            return true;
        });
    }

    async post(reviewForm: IReviewForm): Promise<boolean> {
        return RestUtilities.post("/tenant", reviewForm).then(value => {
            const result = !value.is_error;
            if (result) {
                const snackbarNotification = {
                    message: "Domain request accepted.",
                } as SnackbarNotification;
                const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
                ReduxStore.getStore().dispatch(enqueueSnackbarAction);
            }
            return result;
        });
    }
}
