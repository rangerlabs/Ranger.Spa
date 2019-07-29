import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR, SnackbarAction, SnackbarNotification } from "../actions/SnackbarActions";

export function snackbarReducer(state: SnackbarNotification[] = [] as SnackbarNotification[], action: SnackbarAction) {
    switch (action.type) {
        case ENQUEUE_SNACKBAR:
            return {
                ...state,
                notifications: [
                    ...state,
                    {
                        key: action.notification.key,
                        ...action.notification,
                    },
                ],
            };

        case CLOSE_SNACKBAR:
            return {
                ...state,
                notifications: state.map(notification =>
                    action.notification.dismissAll || notification.key === action.notification.key ? { ...notification, dismissed: true } : { ...notification }
                ),
            };

        case REMOVE_SNACKBAR:
            return {
                ...state,
                notifications: state.filter(notification => notification.key !== action.notification.key),
            };

        default:
            return state;
    }
}
