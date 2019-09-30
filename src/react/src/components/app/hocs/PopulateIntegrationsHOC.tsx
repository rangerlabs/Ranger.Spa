import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import { populateIntegrations } from '../../../redux/actions/IntegrationActions';
import { MergedIntegrationResponseType } from '../../../models/app/integrations/MergedIntegrationTypes';
import IntegrationService from '../../../services/IntegrationService';

const integrationService = new IntegrationService();

interface PopulateIntegrationsComponentProps {
    setIntegrations: (geofences: Array<MergedIntegrationResponseType>) => void;
    selectedProject: IProject;
    integrations: Array<MergedIntegrationResponseType>;
}

const mapStateToProps = (state: ApplicationState) => {
    return { integrations: state.integrations, selectedProject: state.selectedProject };
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
            if (this.props.integrations.length === 0) {
                integrationService.getIntegrations(this.props.selectedProject.name).then(integrationResponse => {
                    this.props.setIntegrations(integrationResponse);
                });
            }
        }

        render() {
            return <Component {...(this.props as P)} />;
        }
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(PopulateIntegrationsComponent);
};

export default populateIntegrationsHOC;
