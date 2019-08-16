import RestUtilities, { IRestResponse } from "./RestUtilities";
import IReviewForm from "../models/landing/IReviewForm";
import ReduxStore from "../ReduxStore";
import { addDomain, DomainState } from "../redux/actions/DomainActions";
import { enqueueSnackbar, SnackbarNotification } from "../redux/actions/SnackbarActions";
import { StatusEnum } from "../models/StatusEnum";

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
                const domain = {
                    domain: reviewForm.domainForm.domain,
                    correlationId: value.correlationId,
                    status: StatusEnum.PENDING,
                } as DomainState;
                const addDomainAction = addDomain(domain);
                ReduxStore.getStore().dispatch(addDomainAction);
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
