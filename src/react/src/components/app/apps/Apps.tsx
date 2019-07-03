import * as React from "react";
import IApp from "../../../models/app/IApp";
import CustomAddToolbar from "../muiDataTable/CustomAddToolbar";
import { connect } from "react-redux";
import { addApp, removeApp } from "../../../redux/actions/AppActions";
import { ApplicationState } from "../../../stores/index";
import { push } from "connected-react-router";
import RoutePaths from "../../../components/RoutePaths";
const MUIDataTable = require("mui-datatables").default;

interface AppsProps {
    apps: IApp[];
    addApp: (app: IApp) => void;
    removeApp: (name: string) => void;
    push: typeof push;
}

const mapStateToProps = (state: ApplicationState) => {
    return { apps: state.apps };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addApp: (app: IApp) => {
            const action = addApp(app);
            dispatch(action);
        },
        removeApp: (name: string) => {
            const action = removeApp(name);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class Apps extends React.Component<AppsProps> {
    refs: {
        query: HTMLInputElement;
    };

    editApp = (rowData: string[]) => {
        this.props.push(`${RoutePaths.AppsEdit}?name=${rowData[0]}`);
    };

    redirectToNewAppForm = () => {
        this.props.push(RoutePaths.AppsNew);
    };

    mapAppsToTableApps(apps: IApp[]): Array<Array<string>> {
        const tableApps = new Array<Array<string>>();
        if (apps) {
            apps.forEach(value => {
                tableApps.push([value.name, value.description, value.apiKey]);
            });
        }
        return tableApps;
    }

    columns = [
        {
            name: "Name",
            options: {
                filter: true,
            },
        },
        {
            name: "Description",
            options: {
                filter: false,
            },
        },
        {
            name: "Api Key",
            options: {
                filter: false,
            },
        },
    ];
    options = {
        print: false,
        download: false,
        customToolbar: () => {
            return <CustomAddToolbar toggleFormFlag={this.redirectToNewAppForm} />;
        },
        elevation: 0,
        selectableRows: false,
        responsive: "scroll",
        viewColumns: false,
        onRowClick: this.editApp,
    };

    render() {
        const { apps } = this.props;
        return (
            <React.Fragment>
                <MUIDataTable title={""} data={this.mapAppsToTableApps(apps)} columns={this.columns} options={this.options} />
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Apps);
