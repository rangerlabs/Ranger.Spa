import { DialogComponent } from "../../components/app/dialogContents/DialogComponent";

export const ERROR_DIALOG_VISIBILITY_FILTER = "SET_ERROR_DIALOG_VISIBILITY_FILTER";

export const OPEN_DIALOG = "OPEN_DIALOG";
export const CLOSE_DIALOG = "CLOSE_DIALOG";

export interface DialogAction {
    type: string;
    dialog: DialogState;
}

export interface DialogState {
    visible: boolean;
    content: DialogContent;
}

export class DialogContent {
    public constructor(
        public title: string,
        public content: DialogComponent | string,
        public confirmText?: string,
        public confirmAction?: Function,
        public cancelAction?: Function
    ) {}
}

export function openDialog(dialogContent: DialogContent): DialogAction {
    return {
        type: OPEN_DIALOG,
        dialog: {
            visible: true,
            content: dialogContent,
        },
    };
}
export function closeDialog(): DialogAction {
    return {
        type: CLOSE_DIALOG,
        dialog: {
            visible: false,
            content: {
                title: undefined,
                content: undefined,
                confirmText: undefined,
                confirmAction: undefined,
                cancelAction: undefined,
            } as DialogContent,
        },
    };
}
