import * as React from 'react';
import { connect } from 'react-redux';
import Loading from '../../loading/Loading';
import { addPendingPrimaryOwnerTransfer } from '../../../redux/actions/OrganizationActions';
import { PendingPrimaryOwnerTransfer } from '../../../models/app/PendingPrimaryOwnerTransfer';
import TenantService from '../../../services/TenantService';
import { getSubDomain, userIsInRole } from '../../../helpers/Helpers';
import { ApplicationState } from '../../../stores';
import { User } from 'oidc-client';
import { RoleEnum } from '../../../models/RoleEnum';

const tenantService = new TenantService();

interface PopulatePendingPrimaryOwnerTransferHOCProps {
    user: User;
    addPendingPrimaryOwnerTransfer: (pendingPrimaryOwnerTransfer: PendingPrimaryOwnerTransfer) => void;
}

interface PopulatePendingPrimaryOwnerTransferHOCState {
    isLoaded: boolean;
    wasError: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return { user: state.oidc.user };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addPendingPrimaryOwnerTransfer: (pendingPrimaryOwnerTransfer: PendingPrimaryOwnerTransfer) => {
            const action = addPendingPrimaryOwnerTransfer(pendingPrimaryOwnerTransfer);
            dispatch(action);
        },
    };
};

const populatePendingPrimaryOwnerTransferHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulatePendingPrimaryOwnerTransferComponent extends React.Component<
        PopulatePendingPrimaryOwnerTransferHOCProps,
        PopulatePendingPrimaryOwnerTransferHOCState
    > {
        state: PopulatePendingPrimaryOwnerTransferHOCState = {
            isLoaded: false,
            wasError: false,
        };

        componentDidMount() {
            if (userIsInRole(this.props.user, RoleEnum.PRIMARY_OWNER)) {
                tenantService.getPrimaryOwnerTransfer(getSubDomain()).then((response) => {
                    if (response.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.setState({ isLoaded: true });
                        if (response.result) {
                            this.props.addPendingPrimaryOwnerTransfer(response.result);
                        }
                    }
                });
            } else {
                this.setState({ isLoaded: true });
            }
        }

        render() {
            return this.state.isLoaded && !this.state.wasError ? <Component {...(this.props as P)} /> : <Loading wasError={this.state.wasError} />;
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(PopulatePendingPrimaryOwnerTransferComponent);
};

export default populatePendingPrimaryOwnerTransferHOC;
