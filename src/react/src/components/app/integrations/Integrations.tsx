import * as React from 'react';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addIntegration, IntegrationsState } from '../../../redux/actions/IntegrationActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import { MergedIntegrationType } from '../../../models/app/integrations/MergedIntegrationTypes';
import RoutePaths from '../../../components/RoutePaths';
import { IntegrationEnum } from '../../../models/app/integrations/IntegrationEnum';
import populateIntegrationsHOC from '../hocs/PopulateIntegrationsHOC';
import titleCase = require('title-case');
import { EnvironmentEnum } from '../../../models/EnvironmentEnum';
import IProject from '../../../models/app/IProject';
const MUIDataTable = require('mui-datatables').default;

interface IntegrationsProps {
    integrationsState: IntegrationsState;
    addIntegration: (integration: MergedIntegrationType) => void;
    push: typeof push;
    selectedProject: IProject;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        integrationsState: state.integrationsState,
        selectedProject: state.selectedProject,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addIntegration: (integration: MergedIntegrationType) => {
            const action = addIntegration(integration);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class Integrations extends React.Component<IntegrationsProps> {
    refs: {
        query: HTMLInputElement;
    };

    editIntegration = (rowData: string[]) => {
        const integrationType = rowData[3].toUpperCase() as keyof typeof IntegrationEnum;
        switch (integrationType) {
            case IntegrationEnum.WEBHOOK: {
                this.props.push(`${RoutePaths.IntegrationsEditWebhook.replace(':appName', this.props.selectedProject.name)}?name=${rowData[1]}`);
            }
        }
    };

    redirectToNewIntegrationForm = () => {
        this.props.push(RoutePaths.IntegrationsNew);
    };

    mapIntegrationsToTableIntegrations(integrations: MergedIntegrationType[]): Array<Array<string>> {
        const tableIntegrations = new Array<Array<string>>();
        if (integrations) {
            integrations.forEach(value => {
                tableIntegrations.push([
                    value.enabled ? 'Enabled' : 'Disabled',
                    value.name,
                    value.description,
                    titleCase(value.type),
                    value.environment === EnvironmentEnum.TEST ? 'Test' : 'Live',
                ]);
            });
        }
        return tableIntegrations;
    }

    columns = [
        {
            name: 'Enabled',
            options: {
                filter: true,
            },
        },
        {
            name: 'Name',
            options: {
                filter: true,
            },
        },
        {
            name: 'Description',
            options: {
                filter: false,
            },
        },
        {
            name: 'Type',
            options: {
                filter: true,
            },
        },
        {
            name: 'Environment',
            options: {
                filter: true,
            },
        },
    ];

    options = {
        textLabels: {
            body: {
                noMatch: 'Your organization has not created any integrations yet.',
            },
        },
        print: false,
        download: false,
        customToolbar: () => {
            return <CustomAddToolbar toggleFormFlag={this.redirectToNewIntegrationForm} />;
        },
        elevation: 0,
        selectableRows: 'none',
        responsive: 'stacked',
        viewColumns: false,
        onRowClick: this.editIntegration,
    };

    render() {
        const { integrationsState } = this.props;
        return (
            <React.Fragment>
                <MUIDataTable
                    title={'Integrations'}
                    data={this.mapIntegrationsToTableIntegrations(integrationsState.integrations)}
                    columns={this.columns}
                    options={this.options}
                />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(populateIntegrationsHOC(Integrations));
