import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import Loading from '../loading/Loading';
import { OrganizationState, populateOrganizationName } from '../../../redux/actions/OrganizationActions';
import TenantService from '../../../services/TenantService';

interface PopulateOrganizationNameComponentProps {
    setOrganizationName: (organizationName: string) => void;
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
        setOrganizationName: (organizationName: string) => {
            const action = populateOrganizationName(organizationName);
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

        componentDidMount() {
            if (!this.props.organizationState.isLoaded) {
                this.tenantService.getOrganizationName(this.props.organizationState.domain).then((organizationResponse) => {
                    if (organizationResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setOrganizationName(organizationResponse.result.organizationName);
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
