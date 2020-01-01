import * as React from 'react';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addGeofence, removeGeofence, GeofencesState } from '../../../redux/actions/GeofenceActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import requireProjectSelection from '../hocs/RequireProjectSelectionHOC';
import populateGeofencesHOC from '../hocs/PopulateGeofencesHOC';
import populateIntegrationsHOC from '../hocs/PopulateIntegrationsHOC';
import titleCase = require('title-case');
const MUIDataTable = require('mui-datatables').default;

interface GeofencesProps {
    geofencesState: GeofencesState;
    addGeofence: (geofence: CircleGeofence | PolygonGeofence) => void;
    removeGeofence: (name: string) => void;
    push: typeof push;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofences: selectedProjectGeofences(state.geofencesState.geofences, state.selectedProject.name) };
};

const selectedProjectGeofences = (geofences: Array<CircleGeofence | PolygonGeofence>, name: string) => {
    return geofences.filter(f => f.projectId === name);
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addGeofence: (geofence: CircleGeofence | PolygonGeofence) => {
            const action = addGeofence(geofence);
            dispatch(action);
        },
        removeGeofence: (name: string) => {
            const action = removeGeofence(name);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class Geofences extends React.Component<GeofencesProps> {
    refs: {
        query: HTMLInputElement;
    };

    editGeofence = (rowData: string[]) => {
        this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map/edit?name=' + rowData[0]);
    };

    redirectToNewGeofenceForm = () => {
        this.props.push('/geofences/map/new');
    };

    mapGeofencesToTableGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): Array<Array<string>> {
        const tableGeofences = new Array<Array<string>>();
        if (geofences) {
            geofences.forEach(value => {
                tableGeofences.push([
                    value.externalId,
                    value.description,
                    titleCase(value.shape.toString()),
                    value.onEnter ? 'True' : 'False',
                    value.onExit ? 'True' : 'False',
                ]);
            });
        }
        return tableGeofences;
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
            return <CustomAddToolbar toggleFormFlag={this.redirectToNewGeofenceForm} />;
        },
        elevation: 0,
        selectableRows: 'none',
        responsive: 'stacked',
        viewColumns: false,
        onRowClick: this.editGeofence,
    };

    render() {
        const { geofencesState: geofencesState } = this.props;
        return (
            <React.Fragment>
                <MUIDataTable
                    title={'Geofences'}
                    data={this.mapGeofencesToTableGeofences(geofencesState.geofences)}
                    columns={this.columns}
                    options={this.options}
                />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(requireProjectSelection(populateIntegrationsHOC(populateGeofencesHOC(Geofences))));
