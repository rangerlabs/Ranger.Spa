import * as React from 'react';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addGeoFence, removeGeoFence } from '../../../redux/actions/GeoFenceActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import PolygonGeoFence from '../../../models/app/geofences/PolygonGeoFence';
import CircularGeoFence from '../../../models/app/geofences/CircularGeoFence';
import requireAppSelection from '../hocs/RequireAppSelectionHOC';
import RoutePaths from '../../../components/RoutePaths';
const MUIDataTable = require('mui-datatables').default;

interface GeoFencesProps {
    geofences: Array<CircularGeoFence | PolygonGeoFence>;
    addGeoFence: (geofence: CircularGeoFence | PolygonGeoFence) => void;
    removeGeoFence: (name: string) => void;
    push: typeof push;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofences: selectedAppGeoFences(state.geofences, state.selectedApp.id) };
};

const selectedAppGeoFences = (geofences: Array<CircularGeoFence | PolygonGeoFence>, id: string) => {
    return geofences.filter(f => f.appId === id);
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addGeoFence: (geofence: CircularGeoFence | PolygonGeoFence) => {
            const action = addGeoFence(geofence);
            dispatch(action);
        },
        removeGeoFence: (name: string) => {
            const action = removeGeoFence(name);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class GeoFences extends React.Component<GeoFencesProps> {
    refs: {
        query: HTMLInputElement;
    };

    editGeoFence = (rowData: string[]) => {
        this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map/edit?name=' + rowData[0]);
    };

    redirectToNewGeoFenceForm = () => {
        this.props.push('/geofences/map/new');
    };

    mapGeoFencesToTableGeoFences(geofences: Array<CircularGeoFence | PolygonGeoFence>): Array<Array<string>> {
        const tableGeoFences = new Array<Array<string>>();
        if (geofences) {
            geofences.forEach(value => {
                tableGeoFences.push([value.name, value.description, value.shape.toString(), value.onEnter ? 'True' : 'False', value.onExit ? 'True' : 'False']);
            });
        }
        return tableGeoFences;
    }

    columns = [
        {
            name: 'Name',
            options: {
                filter: false,
            },
        },
        {
            name: 'Description',
            options: {
                filter: false,
            },
        },
        {
            name: 'Shape',
            options: {
                filter: true,
            },
        },
        {
            name: 'On Enter',
            options: {
                filter: true,
            },
        },
        {
            name: 'On Exit',
            options: {
                filter: true,
            },
        },
    ];
    options = {
        print: false,
        download: false,
        customToolbar: () => {
            return <CustomAddToolbar toggleFormFlag={this.redirectToNewGeoFenceForm} />;
        },
        elevation: 0,
        selectableRows: false,
        responsive: 'stacked',
        viewColumns: false,
        onRowClick: this.editGeoFence,
    };

    render() {
        const { geofences } = this.props;
        return (
            <React.Fragment>
                <MUIDataTable title={''} data={this.mapGeoFencesToTableGeoFences(geofences)} columns={this.columns} options={this.options} />
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(requireAppSelection(GeoFences));
