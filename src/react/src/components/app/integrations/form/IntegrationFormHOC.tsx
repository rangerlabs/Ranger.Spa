import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores';
import { push } from 'connected-react-router';
import { MergedIntegrationType } from '../../../../models/app/integrations/MergedIntegrationType';
import RoutePaths from '../../../RoutePaths';
import { IntegrationEnum } from '../../../../models/app/integrations/IntegrationEnum';
import * as queryString from 'query-string';
import requireAppSelection from '../../hocs/RequireAppSelectionHOC';
import { WithSnackbarProps } from 'notistack';
import IApp from '../../../../models/app/IApp';

type IntegrationFormHOCProps = StateProps & DispatchProps & OwnProps;

interface OwnProps extends WithSnackbarProps {}

interface StateProps {
    integrations: MergedIntegrationType[];
    selectedApp: IApp;
}
interface DispatchProps {
    push: typeof push;
}

interface IntegrationFormHOCState {
    initialIntegration: MergedIntegrationType;
}

const mapStateToProps = (state: ApplicationState): StateProps => {
    return {
        integrations: state.integrations,
        selectedApp: state.selectedApp,
    };
};

const integrationForm = <P extends object>(Component: React.ComponentType<P>) => {
    class IntegrationFormHOCComponent extends React.Component<IntegrationFormHOCProps, IntegrationFormHOCState> {
        state = {
            initialIntegration: undefined as MergedIntegrationType,
        };

        UNSAFE_componentWillMount() {
            if (this.props.selectedApp) {
                if (window.location.pathname === RoutePaths.IntegrationsEditApi.replace(':appName', this.props.selectedApp.name)) {
                    this.checkIntegrationIsCorrectTypeForRoute(IntegrationEnum.API);
                }
            }
        }

        checkIntegrationIsCorrectTypeForRoute(integrationType: IntegrationEnum) {
            let result = undefined as MergedIntegrationType;
            switch (integrationType) {
                case IntegrationEnum.API: {
                    const params = queryString.parse(window.location.search);
                    const name = params['name'] as string;
                    if (name) {
                        result = this.props.integrations.find(i => i.name === name);
                        if (result.type === IntegrationEnum.API) {
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
    )(requireAppSelection(IntegrationFormHOCComponent));
};

export default integrationForm;
