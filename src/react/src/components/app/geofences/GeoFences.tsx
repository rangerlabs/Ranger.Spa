import * as React from 'react';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addGeoFence, removeGeoFence } from '../../../redux/actions/GeoFenceActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import PolygonGeoFence from '../../../models/app/geofences/PolygonGeoFence';
import CircleGeoFence from '../../../models/app/geofences/CircleGeoFence';
import requireProjectSelection from '../hocs/RequireProjectSelectionHOC';
import populateGeofencesHOC from '../hocs/PopulateGeofencesHOC';
import populateIntegrationsHOC from '../hocs/PopulateIntegrationsHOC';
import titleCase = require('title-case');
const MUIDataTable = require('mui-datatables').default;

interface GeoFencesProps {
    geofences: Array<CircleGeoFence | PolygonGeoFence>;
    addGeoFence: (geofence: CircleGeoFence | PolygonGeoFence) => void;
    removeGeoFence: (name: string) => void;
    push: typeof push;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofences: selectedProjectGeoFences(state.geofences, state.selectedProject.name) };
};

const selectedProjectGeoFences = (geofences: Array<CircleGeoFence | PolygonGeoFence>, name: string) => {
    return geofences.filter(f => f.projectName === name);
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addGeoFence: (geofence: CircleGeoFence | PolygonGeoFence) => {
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

    mapGeoFencesToTableGeoFences(geofences: Array<CircleGeoFence | PolygonGeoFence>): Array<Array<string>> {
        const tableGeoFences = new Array<Array<string>>();
        if (geofences) {
            geofences.forEach(value => {
                tableGeoFences.push([
                    value.name,
                    value.description,
                    titleCase(value.shape.toString()),
                    value.onEnter ? 'True' : 'False',
                    value.onExit ? 'True' : 'False',
                ]);
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
        selectableRows: 'none',
        responsive: 'stacked',
        viewColumns: false,
        onRowClick: this.editGeoFence,
    };

    render() {
        const { geofences } = this.props;
        return (
            <React.Fragment>
                <MUIDataTable title={'Geofences'} data={this.mapGeoFencesToTableGeoFences(geofences)} columns={this.columns} options={this.options} />
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(requireProjectSelection(populateIntegrationsHOC(populateGeofencesHOC(GeoFences))));
