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
import { FormikBag, FormikProps } from 'formik';
import populateIntegrationsHOC from '../../hocs/PopulateIntegrationsHOC';
import FormikSelectValues from '../../../form/interfaces/FormikSelectValuesProp';
import { EnvironmentEnum } from '../../../../models/EnvironmentEnum';
import { User } from 'oidc-client';
import { userIsInRole } from '../../../../helpers/Helpers';
import { RoleEnum } from '../../../../models/RoleEnum';

const integrationService = new IntegrationService();

type IntegrationFormHOCProps = StateProps & DispatchProps & OwnProps;

interface OwnProps extends WithSnackbarProps {}

interface StateProps {
    user: User;
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
        user: state.oidc.user,
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
            serverErrors: undefined as string[],
        };

        componentDidMount() {
            if (this.props.selectedProject.name) {
                if (window.location.pathname.includes(RoutePaths.IntegrationsEditWebhook.replace('/:appName', ''))) {
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
                        result = this.props.integrationsState.integrations.find((i) => i.name === name);
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

        saveIntegration = (formikBag: FormikBag<FormikProps<MergedIntegrationType>, MergedIntegrationType>, integration: MergedIntegrationType) => {
            integration.version = 0;
            integrationService.postIntegration(this.props.selectedProject.projectId, integration).then((v) => {
                if (!v.isError) {
                    this.setState({ isSuccess: true });
                    integration.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                    this.props.saveIntegrationToState(integration);
                    this.props.push('/' + this.props.selectedProject.name + '/integrations');
                } else {
                    formikBag.setSubmitting(false);
                    this.setState({ isSuccess: false });
                }
            });
        };

        updateIntegration = (formikBag: FormikBag<FormikProps<MergedIntegrationType>, MergedIntegrationType>, integration: MergedIntegrationType) => {
            integration.version = this.state.editIntegration.version + 1;
            integrationService.putIntegration(this.props.selectedProject.projectId, this.state.editIntegration.integrationId, integration).then((v) => {
                if (!v.isError) {
                    this.setState({ isSuccess: true });
                    integration.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                    this.props.removeIntegration(this.state.editIntegration.name);
                    this.props.addIntegrationToPendingUpdate(this.state.editIntegration);
                    this.props.saveIntegrationToState(integration);
                    this.props.push('/' + this.props.selectedProject.name + '/integrations');
                } else {
                    formikBag.setSubmitting(false);
                    this.setState({ isSuccess: false });
                }
            });
        };

        deleteIntegration = (formikProps: FormikProps<MergedIntegrationType>) => {
            integrationService.deleteIntegration(this.props.selectedProject.projectId, this.state.editIntegration.name).then((v) => {
                if (!v.isError) {
                    this.state.editIntegration.correlationModel = { correlationId: v.correlationId, status: StatusEnum.PENDING };
                    this.props.addIntegrationToPendingDeletion(this.state.editIntegration);
                    this.props.removeIntegration(this.state.editIntegration.name);
                    this.props.push('/' + this.props.selectedProject.name + '/integrations');
                } else {
                    formikProps.setSubmitting(false);
                    this.setState({ isSuccess: false });
                }
            });
        };

        render() {
            return (
                <Component
                    editIntegration={this.state.editIntegration}
                    save={this.saveIntegration}
                    update={this.updateIntegration}
                    delete={this.deleteIntegration}
                    isSuccess={this.state.isSuccess}
                    serverErrors={this.state.serverErrors}
                    isPendingCreation={
                        this.state.editIntegration?.correlationModel?.status === StatusEnum.PENDING && !this.state.editIntegration?.integrationId
                    }
                    environmentSelectValuesArray={environmentSelectValuesArray}
                    canEdit={Boolean(userIsInRole(this.props.user, RoleEnum.ADMIN))}
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
