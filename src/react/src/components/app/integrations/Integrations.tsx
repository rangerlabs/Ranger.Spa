import * as React from 'react';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addIntegration, removeIntegration } from '../../../redux/actions/IntegrationActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import { MergedIntegrationResponseType } from '../../../models/app/integrations/MergedIntegrationTypes';
import requireProjectSelection from '../hocs/RequireProjectSelectionHOC';
import RoutePaths from '../../../components/RoutePaths';
import { IntegrationEnum } from '../../../models/app/integrations/IntegrationEnum';
import populateIntegrationsHOC from '../hocs/PopulateIntegrationsHOC';
import titleCase = require('title-case');
const MUIDataTable = require('mui-datatables').default;

interface IntegrationsProps {
    integrations: MergedIntegrationResponseType[];
    addIntegration: (integration: MergedIntegrationResponseType) => void;
    removeIntegration: (name: string) => void;
    push: typeof push;
}

const mapStateToProps = (state: ApplicationState) => {
    return { integrations: selectedProjectIntegrations(state.integrations, state.selectedProject.name) };
};

const selectedProjectIntegrations = (integrations: MergedIntegrationResponseType[], id: string) => {
    return integrations.filter(i => i.projectName === id);
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addIntegration: (integration: MergedIntegrationResponseType) => {
            const action = addIntegration(integration);
            dispatch(action);
        },
        removeIntegration: (name: string) => {
            const action = removeIntegration(name);
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
        const integrationType = rowData[2] as keyof typeof IntegrationEnum;
        switch (integrationType) {
            case IntegrationEnum.WEBHOOK: {
                this.props.push(`${RoutePaths.IntegrationsEditWebhook}?name=${rowData[0]}`);
            }
        }
    };

    redirectToNewIntegrationForm = () => {
        this.props.push(RoutePaths.IntegrationsNew);
    };

    mapIntegrationsToTableIntegrations(integrations: MergedIntegrationResponseType[]): Array<Array<string>> {
        const tableIntegrations = new Array<Array<string>>();
        if (integrations) {
            integrations.forEach(value => {
                tableIntegrations.push([value.name, value.description, titleCase(value.type)]);
            });
        }
        return tableIntegrations;
    }

    columns = [
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
    ];

    options = {
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
        const { integrations } = this.props;
        return (
            <React.Fragment>
                <MUIDataTable
                    title={'Integrations'}
                    data={this.mapIntegrationsToTableIntegrations(integrations)}
                    columns={this.columns}
                    options={this.options}
                />
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(requireProjectSelection(populateIntegrationsHOC(Integrations)));
