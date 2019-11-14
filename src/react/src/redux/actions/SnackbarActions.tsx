import { OptionsObject } from 'notistack';
import { ReactText } from 'react';

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export interface SnackbarAction {
    type: string;
    notification: SnackbarNotification;
}

export interface SnackbarNotification {
    message: any;
    options?: OptionsObject;
    key: ReactText;
    dismissAll?: boolean;
    dismissed: boolean;
}

export const enqueueSnackbar = (notification: SnackbarNotification): SnackbarAction => {
    const key = notification.options && notification.options.key;

    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            ...notification,
            key: key || new Date().getTime() + Math.random(),
        },
    };
};

export const closeSnackbar = (key: number) => ({
    type: CLOSE_SNACKBAR,
    notification: {
        dismissAll: !key, // dismiss all if no key has been defined
        key,
    },
});

export const removeSnackbar = (key: number) => ({
    type: REMOVE_SNACKBAR,
    notification: {
        key,
    },
});
