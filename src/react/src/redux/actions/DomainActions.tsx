import CorrelationModel from "../../models/CorrelationModel";

export const ADD_DOMAIN = "ADD_DOMAIN";

export interface DomainAction {
    type: string;
    domain: DomainState;
}

export interface DomainState extends CorrelationModel {
    domain: string;
}

export function addDomain(domain: DomainState): DomainAction {
    return {
        type: ADD_DOMAIN,
        domain,
    };
}
