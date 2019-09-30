import * as React from 'react';
import { Typography } from '@material-ui/core';
import TenantService from '../../../services/TenantService';
import * as queryString from 'query-string';
import IConfirmModel from '../../../models/landing/IConfirmModel';
const tenantService = new TenantService();

interface ConfirmDomainState {
    confirmed: boolean;
    isRequesting: boolean;
}

export default class ConfirmDomain extends React.Component<null, ConfirmDomainState> {
    state: ConfirmDomainState = {
        confirmed: undefined,
        isRequesting: true,
    };

    getRegistrationKeyFromParams(): string {
        const params = queryString.parse(window.location.search);
        const registrationKey = params['registrationKey'] as string;
        return registrationKey;
    }

    getDomainFromParams(): string {
        const params = queryString.parse(window.location.search);
        const domain = params['domain'] as string;
        return domain;
    }
    componentDidMount() {
        const domain = this.getDomainFromParams();
        const registrationKey = this.getRegistrationKeyFromParams();
        const confirmModel = {
            RegistrationKey: registrationKey,
        } as IConfirmModel;
        tenantService
            .confirm(domain, confirmModel)
            .then(v => this.setState({ confirmed: v, isRequesting: false }))
            .catch(r => {
                this.setState({ isRequesting: false });
                console.log(`Failed to confirm domain. Reason: ${r}.`);
            });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.isRequesting && (
                    <Typography align="center" variant="h6">
                        Please wait while we confirm your domain.
                    </Typography>
                )}
                {!this.state.isRequesting && this.state.confirmed && (
                    <Typography align="center" variant="h6">
                        Your domain is confirmed.
                    </Typography>
                )}
                {!this.state.isRequesting && !this.state.confirmed && (
                    <Typography align="center" variant="h6">
                        Failed to confirm domain. Verify the registration key is correct.
                    </Typography>
                )}
            </React.Fragment>
        );
    }
}
