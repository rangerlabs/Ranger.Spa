import CorrelationModel from '../../models/CorrelationModel';
import { PendingPrimaryOwnerTransfer } from '../../models/app/PendingPrimaryOwnerTransfer';

export const ADD_DOMAIN = 'ADD_DOMAIN';
export const ADD_PENDING_PRIMARY_OWNER_TRANSFER = 'ADD_PENDING_PRIMARY_OWNER_TRANSFER';
export const REMOVE_PENDING_PRIMARY_OWNER_TRANSFER = 'REMOVE_PENDING_PRIMARY_OWNER_TRANSFER';

export interface DomainAction {
    type: string;
    domain: DomainState;
}

export interface DomainState extends CorrelationModel {
    domain: string;
    pendingPrimaryOwnerTransfer: PendingPrimaryOwnerTransfer;
}

export function addDomain(domain: DomainState): DomainAction {
    return {
        type: ADD_DOMAIN,
        domain,
    };
}

export function addPendingPrimaryOwnerTransfer(pendingPrimaryOwnerTransfer: PendingPrimaryOwnerTransfer) {
    return {
        type: ADD_PENDING_PRIMARY_OWNER_TRANSFER,
        domain: { pendingPrimaryOwnerTransfer: pendingPrimaryOwnerTransfer } as DomainState,
    };
}

export function removePendingPrimaryOwnerTransfer() {
    return {
        type: REMOVE_PENDING_PRIMARY_OWNER_TRANSFER,
        domain: { pendingPrimaryOwnerTransfer: undefined } as DomainState,
    };
}
