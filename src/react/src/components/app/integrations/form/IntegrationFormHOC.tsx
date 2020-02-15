import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores';
import { push } from 'connected-react-router';
import { MergedIntegrationType } from '../../../../models/app/integrations/MergedIntegrationTypes';
import RoutePaths from '../../../RoutePaths';
import { IntegrationEnum } from '../../../../models/app/integrations/IntegrationEnum';
import * as queryString from 'query-string';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import IProject from '../../../../models/app/IProject';
import {
    IntegrationsState,
    addIntegration,
    addIntegrationToPendingDeletion,
    addIntegrationToPendingUpdate,
    removeIntegrationByName,
} from '../../../../redux/actions/IntegrationActions';
import IntegrationService from '../../../../services/IntegrationService';
import { StatusEnum } from '../../../../models/StatusEnum';
import { Formik } from 'formik';
import populateIntegrationsHOC from '../../hocs/PopulateIntegrationsHOC';
import FormikSelectValues from '../../../form/interfaces/FormikSelectValuesProp';
import { EnvironmentEnum } from '../../../../models/EnvironmentEnum';

const integrationService = new IntegrationService();

type IntegrationFormHOCProps = StateProps & DispatchProps & OwnProps;

interface OwnProps extends WithSnackbarProps {}

interface StateProps {
    integrationsState: IntegrationsState;
    selectedProject: IProject;
}
interface DispatchProps {
    saveIntegrationToState: (integration: MergedIntegrationType) => void;
    addIntegrationToPendingDeletion: (integration: MergedIntegrationType) => void;
    addIntegrationToPendingUpdate: (integration: MergedIntegrationType) => void;
    push: (path: string) => void;
    removeIntegration: (name: string) => void;
}

interface IntegrationFormHOCState {
    editIntegration: MergedIntegrationType;
    isSuccess: boolean;
    serverErrors: string[];
}

const mapStateToProps = (state: ApplicationState): StateProps => {
    return {
        integrationsState: state.integrationsState,
        selectedProject: state.selectedProject,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        saveIntegrationToState: (integration: MergedIntegrationType) => {
            const action = addIntegration(integration);
            dispatch(action);
        },
        addIntegrationToPendingDeletion: (integration: MergedIntegrationType) => {
            const action = addIntegrationToPendingDeletion(integration);
            dispatch(action);
        },
        addIntegrationToPendingUpdate: (integration: MergedIntegrationType) => {
            const action = addIntegrationToPendingUpdate(integration);
            dispatch(action);
        },
        removeIntegration: (name: string) => {
            const action = removeIntegrationByName(name);
            dispatch(action);
        },
        push: (path: string) => {
            dispatch(push(path));
        },
    };
};

const environmentSelectValuesArray = [
    { value: EnvironmentEnum.TEST, label: 'Test' },
    { value: EnvironmentEnum.LIVE, label: 'Live' },
] as FormikSelectValues;

const integrationForm = <P extends object>(Component: React.ComponentType<P>) => {
    class IntegrationFormHOCComponent extends React.Component<IntegrationFormHOCProps, IntegrationFormHOCState> {
        state: IntegrationFormHOCState = {
            editIntegration: undefined as MergedIntegrationType,
            isSuccess: false,
            serverErrors: [],
        };

        componentDidMount() {
            if (this.props.selectedProject.name) {
                if (window.location.pathname === RoutePaths.IntegrationsEditWebhook.replace(':appName', this.props.selectedProject.name)) {
                    this.checkIntegrationIsCorrectTypeForRoute(IntegrationEnum.WEBHOOK);
                }
            }
        }

        checkIntegrationIsCorrectTypeForRoute(integrationType: IntegrationEnum) {
            let result = undefined as MergedIntegrationType;
            switch (integrationType) {
                case IntegrationEnum.WEBHOOK: {
                    const params = queryString.parse(window.location.search);
                    const name = params['name'] as string;
                    if (name) {
                        result = this.props.integrationsState.integrations.find(i => i.name === name);
                        if (!result) {
                            this.props.push(RoutePaths.Dashboard);
                        }
                        if (result.type === IntegrationEnum.WEBHOOK) {
                            this.setState({ editIntegration: result });
                        } else {
                            this.props.push(RoutePaths.Dashboard);
                        }
                    }
                    break;
                }
            }
        }

        saveIntegration = (formikRef: React.RefObject<Formik>, integration: MergedIntegrationType) => {
            integrationService.postIntegration(this.props.selectedProject.name, integration).then(v => {
                if (!v.is_error) {
                    this.setState({ isSuccess: true });
                    integration.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                    this.props.saveIntegrationToState(integration);
                    this.props.enqueueSnackbar(`Integration '${integration.name}' is pending creation.`, { variant: 'info' });
                    this.props.push('/' + this.props.selectedProject.name + '/integrations');
                } else {
                    formikRef.current.setSubmitting(false);
                    this.setState({ isSuccess: false });
                }
            });
        };

        updateIntegration = (formikRef: React.RefObject<Formik>, integration: MergedIntegrationType) => {
            integration.version = this.state.editIntegration.version + 1;
            integrationService.putIntegration(this.props.selectedProject.name, this.state.editIntegration.id, integration).then(v => {
                if (!v.is_error) {
                    this.setState({ isSuccess: true });
                    integration.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                    this.props.removeIntegration(this.state.editIntegration.name);
                    this.props.addIntegrationToPendingUpdate(this.state.editIntegration);
                    this.props.saveIntegrationToState(integration);
                    this.props.enqueueSnackbar(`Integration '${integration.name}' is pending update.`, { variant: 'info' });
                    this.props.push('/' + this.props.selectedProject.name + '/integrations');
                } else {
                    formikRef.current.setSubmitting(false);
                    this.setState({ isSuccess: false });
                }
            });
        };

        deleteIntegration = (formikRef: React.RefObject<Formik>) => {
            integrationService.deleteIntegration(this.props.selectedProject.name, this.state.editIntegration.name).then(v => {
                if (!v.is_error) {
                    this.state.editIntegration.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                    this.props.addIntegrationToPendingDeletion(this.state.editIntegration);
                    this.props.removeIntegration(this.state.editIntegration.name);
                    this.props.enqueueSnackbar(`Integration '${this.state.editIntegration.name}' is pending deletion.`, { variant: 'info' });
                    this.props.push('/' + this.props.selectedProject.name + '/integrations');
                } else {
                    formikRef.current.setSubmitting(false);
                    this.setState({ isSuccess: false });
                }
            });
        };

        // isPendingCreation = this.state.editIntegration?.correlationModel?.status === StatusEnum.PENDING && !this.state.editIntegration?.id;

        render() {
            return (
                <Component
                    editIntegration={this.state.editIntegration}
                    save={this.saveIntegration}
                    update={this.updateIntegration}
                    delete={this.deleteIntegration}
                    isSuccess={this.state.isSuccess}
                    serverErrors={this.state.serverErrors}
                    isPendingCreation={this.state.editIntegration?.correlationModel?.status === StatusEnum.PENDING && !this.state.editIntegration?.id}
                    environmentSelectValuesArray={environmentSelectValuesArray}
                    {...(this.props as P)}
                />
            );
        }
    }
    return connect<StateProps, DispatchProps, OwnProps>(
        mapStateToProps,
        mapDispatchToProps
    )(populateIntegrationsHOC(withSnackbar(IntegrationFormHOCComponent)));
};

export default integrationForm;
