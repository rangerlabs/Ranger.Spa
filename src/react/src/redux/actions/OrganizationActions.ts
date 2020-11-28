import CorrelationModel from '../../models/CorrelationModel';
import { PendingPrimaryOwnerTransfer } from '../../models/app/PendingPrimaryOwnerTransfer';

export const SET_DOMAIN = 'SET_DOMAIN';
export const POPULATE_ORGANIZATION_NAME = 'POPULATE_ORGANIZATION_NAME';
export const ADD_PENDING_PRIMARY_OWNER_TRANSFER = 'ADD_PENDING_PRIMARY_OWNER_TRANSFER';
export const REMOVE_PENDING_PRIMARY_OWNER_TRANSFER = 'REMOVE_PENDING_PRIMARY_OWNER_TRANSFER';

export interface OrganizationAction {
    type: string;
    organization: OrganizationState;
}

export interface OrganizationState extends CorrelationModel {
    domain: string;
    organizationName: string;
    version: number;
    pendingPrimaryOwnerTransfer: PendingPrimaryOwnerTransfer;
    isLoaded: boolean;
}

export function setDomain(domain: string): OrganizationAction {
    return {
        type: SET_DOMAIN,
        organization: {
            domain: domain,
        } as OrganizationState,
    };
}

export function populateOrganization(organizationName: string, version: number): OrganizationAction {
    return {
        type: POPULATE_ORGANIZATION_NAME,
        organization: {
            isLoaded: true,
            organizationName: organizationName,
            version: version,
        } as OrganizationState,
    };
}

export function addPendingPrimaryOwnerTransfer(pendingPrimaryOwnerTransfer: PendingPrimaryOwnerTransfer) {
    return {
        type: ADD_PENDING_PRIMARY_OWNER_TRANSFER,
        organization: { pendingPrimaryOwnerTransfer: pendingPrimaryOwnerTransfer } as OrganizationState,
    };
}

export function removePendingPrimaryOwnerTransfer() {
    return {
        type: REMOVE_PENDING_PRIMARY_OWNER_TRANSFER,
        organization: { pendingPrimaryOwnerTransfer: undefined } as OrganizationState,
    };
}
