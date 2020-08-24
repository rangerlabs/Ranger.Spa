export const SET_DELETING_ACCOUNT = 'SET_DELETING_ACCOUNT';

export interface AccountAction {
    type: string;
    accountState: AccountState;
}

export interface AccountState {
    isDeleting: boolean;
}

export function setAccountDeleting(value: boolean): AccountAction {
    return {
        type: SET_DELETING_ACCOUNT,
        accountState: { isDeleting: value } as AccountState,
    };
}
