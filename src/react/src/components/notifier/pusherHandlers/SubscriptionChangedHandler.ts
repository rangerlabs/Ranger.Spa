import PusherNotificationModel from '../../../models/PusherNotificationModel';
import ReduxStore from '../../../ReduxStore';
import { SnackbarNotification, enqueueSnackbar } from '../../../redux/actions/SnackbarActions';
import { populateSubscriptionLimitDetails } from '../../../redux/actions/SubscriptionLimitDetailsActions';
import SubscriptionsService from '../../../services/SubscriptionsService';

const subscriptionService = new SubscriptionsService();

export default function SubscriptionChangedHandler(data: PusherNotificationModel): void {
    const oidcState = ReduxStore.getState().oidc;

    if (!oidcState.isLoadingUser && oidcState.user && !oidcState.user.expired) {
        const snackbarNotification = {
            message: data.message,
            options: {
                variant: 'success',
            },
        } as SnackbarNotification;
        const store = ReduxStore.getStore();
        const enqueueSnackbarAction = enqueueSnackbar(snackbarNotification);
        store.dispatch(enqueueSnackbarAction);

        subscriptionService.getSubscriptionLimitDetails().then((response) => {
            if (!response.isError) {
                const populateSubscriptionLimitDetailsAction = populateSubscriptionLimitDetails(response.result);
                store.dispatch(populateSubscriptionLimitDetailsAction);
            }
        });
    }
}
