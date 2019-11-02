import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { populateIntegrations, IntegrationsState } from '../../../redux/actions/IntegrationActions';
import { MergedIntegrationResponseType } from '../../../models/app/integrations/MergedIntegrationTypes';
import IntegrationService from '../../../services/IntegrationService';
import populateProjectsHOC from './PopulateProjectsHOC';
import Loading from '../loading/Loading';

const integrationService = new IntegrationService();

interface PopulateIntegrationsComponentProps {
    setIntegrations: (geofences: Array<MergedIntegrationResponseType>) => void;
    selectedProject: IProject;
    integrationsState: IntegrationsState;
}

const mapStateToProps = (state: ApplicationState) => {
    return { integrationsState: state.integrationsState, selectedProject: state.selectedProject };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setIntegrations: (integrations: Array<MergedIntegrationResponseType>) => {
            const action = populateIntegrations(integrations);
            dispatch(action);
        },
    };
};

const populateIntegrationsHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateIntegrationsComponent extends React.Component<PopulateIntegrationsComponentProps> {
        componentDidMount() {
            if (!this.props.integrationsState.isLoaded) {
                integrationService.getIntegrations(this.props.selectedProject.name).then(integrationResponse => {
                    setTimeout(() => {
                        this.props.setIntegrations(integrationResponse);
                    }, 350);
                });
            }
        }

        render() {
            return this.props.integrationsState.isLoaded ? <Component {...(this.props as P)} /> : <Loading message="Retrieving integrations." />;
        }
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(populateProjectsHOC(PopulateIntegrationsComponent));
};

export default populateIntegrationsHOC;
