import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { populateIntegrations, IntegrationsState } from '../../../redux/actions/IntegrationActions';
import { MergedIntegrationType } from '../../../models/app/integrations/MergedIntegrationTypes';
import IntegrationService from '../../../services/IntegrationService';
import populateProjectsHOC from './PopulateProjectsHOC';
import Loading from '../loading/Loading';
import requireProjectSelection from './RequireProjectSelectionHOC';

const integrationService = new IntegrationService();

interface PopulateIntegrationsComponentProps {
    setIntegrations: (geofences: Array<MergedIntegrationType>) => void;
    selectedProject: IProject;
    integrationsState: IntegrationsState;
}

interface PopulateIntegrationsState {
    wasError: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return { integrationsState: state.integrationsState, selectedProject: state.selectedProject };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setIntegrations: (integrations: Array<MergedIntegrationType>) => {
            const action = populateIntegrations(integrations);
            dispatch(action);
        },
    };
};

const populateIntegrationsHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateIntegrationsComponent extends React.Component<PopulateIntegrationsComponentProps, PopulateIntegrationsState> {
        state: PopulateIntegrationsState = {
            wasError: false,
        };
        componentDidUpdate(prevProps: PopulateIntegrationsComponentProps) {
            if (
                !this.props.integrationsState.isLoaded &&
                this.props.selectedProject.name &&
                this.props.selectedProject.name !== prevProps.selectedProject.name
            ) {
                integrationService.getIntegrations(this.props.selectedProject.name).then((integrationResponse) => {
                    if (integrationResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setIntegrations(integrationResponse.result ? integrationResponse.result : new Array<MergedIntegrationType>());
                    }
                });
            }
        }

        componentDidMount() {
            if (!this.props.integrationsState.isLoaded && this.props.selectedProject.name) {
                integrationService.getIntegrations(this.props.selectedProject.name).then((integrationResponse) => {
                    if (integrationResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setIntegrations(integrationResponse.result ? integrationResponse.result : new Array<MergedIntegrationType>());
                    }
                });
            }
        }

        render() {
            return this.props.integrationsState.isLoaded && !this.state.wasError ? (
                <Component {...(this.props as P)} />
            ) : (
                <Loading wasError={this.state.wasError} message="Retrieving integrations" />
            );
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(requireProjectSelection(populateProjectsHOC(PopulateIntegrationsComponent)));
};

export default populateIntegrationsHOC;
