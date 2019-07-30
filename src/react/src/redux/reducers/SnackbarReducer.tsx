import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR, SnackbarAction, SnackbarNotification } from "../actions/SnackbarActions";
import { OptionsObject } from "notistack";
const defaultOptions = {
    variant: "info",
} as OptionsObject;

export function snackbarReducer(state: SnackbarNotification[] = [] as SnackbarNotification[], action: SnackbarAction): SnackbarNotification[] {
    switch (action.type) {
        case ENQUEUE_SNACKBAR:
            return state.concat({
                ...action.notification,
                key: action.notification.key,
                options: { ...defaultOptions, ...action.notification.options },
            });
        case CLOSE_SNACKBAR:
            return state.map(notification =>
                action.notification.dismissAll || notification.key === action.notification.key ? { ...notification, dismissed: true } : { ...notification }
            );
        case REMOVE_SNACKBAR:
            return state.filter(notification => notification.key !== action.notification.key);
        default:
            return state;
    }
}
