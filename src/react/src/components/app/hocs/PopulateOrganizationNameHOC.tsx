import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import Loading from '../../loading/Loading';
import { OrganizationState, populateOrganization } from '../../../redux/actions/OrganizationActions';
import TenantService from '../../../services/TenantService';

interface PopulateOrganizationNameComponentProps {
    setOrganization: (organizationName: string, version: number) => void;
    organizationState: OrganizationState;
}

interface PopulateOrganizationNameComponentState {
    wasError: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return { organizationState: state.organizationState };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setOrganization: (organizationName: string, version: number) => {
            const action = populateOrganization(organizationName, version);
            dispatch(action);
        },
    };
};

const populateOrganizationNameHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateOrganizationNameComponent extends React.Component<PopulateOrganizationNameComponentProps, PopulateOrganizationNameComponentState> {
        tenantService = new TenantService();

        state: PopulateOrganizationNameComponentState = {
            wasError: false,
        };

        componentDidUpdate(prevProps: PopulateOrganizationNameComponentProps) {
            if (this.props.organizationState.domain !== prevProps.organizationState.domain) {
                this.tenantService.getOrganizationName(this.props.organizationState.domain).then((organizationResponse) => {
                    if (organizationResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setOrganization(organizationResponse.result.organizationName, organizationResponse.result.version);
                    }
                });
            }
        }

        componentDidMount() {
            if (!this.props.organizationState.isLoaded && this.props.organizationState.domain) {
                this.tenantService.getOrganizationName(this.props.organizationState.domain).then((organizationResponse) => {
                    if (organizationResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setOrganization(organizationResponse.result.organizationName, organizationResponse.result.version);
                    }
                });
            }
        }

        render() {
            return this.props.organizationState.isLoaded && !this.state.wasError ? (
                <Component {...(this.props as P)} />
            ) : (
                <Loading wasError={this.state.wasError} />
            );
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(PopulateOrganizationNameComponent);
};

export default populateOrganizationNameHOC;
