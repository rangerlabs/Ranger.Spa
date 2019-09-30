import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores';
import { push } from 'connected-react-router';
import { MergedIntegrationResponseType } from '../../../../models/app/integrations/MergedIntegrationTypes';
import RoutePaths from '../../../RoutePaths';
import { IntegrationEnum } from '../../../../models/app/integrations/IntegrationEnum';
import * as queryString from 'query-string';
import requireProjectSelection from '../../hocs/RequireProjectSelectionHOC';
import { WithSnackbarProps } from 'notistack';
import IProject from '../../../../models/app/IProject';

type IntegrationFormHOCProps = StateProps & DispatchProps & OwnProps;

interface OwnProps extends WithSnackbarProps {}

interface StateProps {
    integrations: MergedIntegrationResponseType[];
    selectedProject: IProject;
}
interface DispatchProps {
    push: typeof push;
}

interface IntegrationFormHOCState {
    initialIntegration: MergedIntegrationResponseType;
}

const mapStateToProps = (state: ApplicationState): StateProps => {
    return {
        integrations: state.integrations,
        selectedProject: state.selectedProject,
    };
};

const integrationForm = <P extends object>(Component: React.ComponentType<P>) => {
    class IntegrationFormHOCComponent extends React.Component<IntegrationFormHOCProps, IntegrationFormHOCState> {
        state = {
            initialIntegration: undefined as MergedIntegrationResponseType,
        };

        componentDidMount() {
            if (this.props.selectedProject) {
                if (window.location.pathname === RoutePaths.IntegrationsEditWebhook.replace(':appName', this.props.selectedProject.name)) {
                    this.checkIntegrationIsCorrectTypeForRoute(IntegrationEnum.WEBHOOK);
                }
            }
        }

        checkIntegrationIsCorrectTypeForRoute(integrationType: IntegrationEnum) {
            let result = undefined as MergedIntegrationResponseType;
            switch (integrationType) {
                case IntegrationEnum.WEBHOOK: {
                    const params = queryString.parse(window.location.search);
                    const name = params['name'] as string;
                    if (name) {
                        result = this.props.integrations.find(i => i.name === name);
                        if (result.type === IntegrationEnum.WEBHOOK) {
                            this.setState({ initialIntegration: result });
                        } else {
                            this.props.push('/');
                        }
                    }
                    break;
                }
            }
        }

        render() {
            return <Component initialIntegration={this.state.initialIntegration} {...(this.props as P)} />;
        }
    }
    return connect<StateProps, DispatchProps, OwnProps>(
        mapStateToProps,
        { push }
    )(requireProjectSelection(IntegrationFormHOCComponent));
};

export default integrationForm;
