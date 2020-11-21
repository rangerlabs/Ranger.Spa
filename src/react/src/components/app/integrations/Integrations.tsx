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
import { EnvironmentEnum } from '../../../models/EnvironmentEnum';
import IProject from '../../../models/app/IProject';
import { Grid, Theme, createStyles, withStyles, WithStyles, TableFooter } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { capitalCase } from 'change-case';
import { userIsInRole } from '../../../helpers/Helpers';
import { User } from 'oidc-client';
import { RoleEnum } from '../../../models/RoleEnum';
const MUIDataTable = require('mui-datatables').default;

const styles = (theme: Theme) =>
    createStyles({
        grid: {
            padding: theme.spacing(2),
        },
        footer: {
            display: 'block',
            height: '54px',
        },
        tableIcon: {
            paddingRight: theme.spacing(1),
            verticalAlign: 'middle',
        },
    });

interface IntegrationsProps extends WithStyles<typeof styles> {
    user: User;
    integrationsState: IntegrationsState;
    addIntegration: (integration: MergedIntegrationType) => void;
    push: typeof push;
    selectedProject: IProject;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        integrationsState: state.integrationsState,
        selectedProject: state.selectedProject,
        user: state.oidc.user,
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
        const integrationType = capitalCase(rowData[4]);
        switch (integrationType) {
            case IntegrationEnum.WEBHOOK: {
                this.props.push(`${RoutePaths.IntegrationsEditWebhook.replace(':appName', this.props.selectedProject.name)}?name=${rowData[1]}`);
                break;
            }
            case IntegrationEnum.PUSHER: {
                this.props.push(`${RoutePaths.IntegrationsEditPusher.replace(':appName', this.props.selectedProject.name)}?name=${rowData[1]}`);
                break;
            }
        }
    };

    redirectToNewIntegrationForm = () => {
        this.props.push(RoutePaths.IntegrationsNew);
    };

    mapIntegrationsToTableIntegrations(integrations: MergedIntegrationType[]): Array<Array<string>> {
        const tableIntegrations = new Array<Array<string>>();
        if (integrations) {
            integrations.forEach((value) => {
                tableIntegrations.push([
                    value.enabled ? 'Enabled' : 'Disabled',
                    value.name,
                    value.isDefault ? 'True' : 'False',
                    value.description,
                    capitalCase(value.type),
                    value.environment === EnvironmentEnum.TEST ? 'Test' : 'Live',
                ]);
            });
        }
        return tableIntegrations;
    }

    booleanRender = (value: string, trueValue: string): JSX.Element => {
        return value === trueValue ? (
            <React.Fragment>
                <CheckCircleIcon style={{ fontSize: 22 }} className={this.props.classes.tableIcon} color="primary" />
                {value}
            </React.Fragment>
        ) : (
            <React.Fragment>
                <HighlightOffIcon style={{ fontSize: 22 }} className={this.props.classes.tableIcon} color="error" />
                {value}
            </React.Fragment>
        );
    };

    columns = [
        {
            name: 'Enabled',
            options: {
                filter: true,
                customBodyRender: (value: string) => {
                    return this.booleanRender(value, 'Enabled');
                },
            },
        },
        {
            name: 'Name',
            options: {
                filter: true,
            },
        },
        {
            name: 'Is Default',
            options: {
                filter: true,
                customBodyRender: (value: string) => {
                    return this.booleanRender(value, 'True');
                },
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
            return Boolean(userIsInRole(this.props.user, RoleEnum.ADMIN)) ? <CustomAddToolbar toggleFormFlag={this.redirectToNewIntegrationForm} /> : null;
        },
        customFooter: this.props.integrationsState.integrations?.length > 10 ? null : () => <TableFooter className={this.props.classes.footer} />,
        elevation: 3,
        selectableRows: 'none',
        responsive: 'vertical',
        viewColumns: false,
        tableBodyMaxHeight: 'calc(100vh - 32px - 48px - 64px - 52px)',
        onRowClick: this.editIntegration,
    };

    render() {
        const { classes, integrationsState } = this.props;
        return (
            <Grid className={classes.grid} container justify="center" alignItems="center">
                <Grid item xs={12}>
                    <MUIDataTable
                        title={'Integrations'}
                        data={this.mapIntegrationsToTableIntegrations(integrationsState.integrations)}
                        columns={this.columns}
                        options={this.options}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateIntegrationsHOC(Integrations)));
