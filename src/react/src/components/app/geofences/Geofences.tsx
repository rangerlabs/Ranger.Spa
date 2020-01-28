import * as React from 'react';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addGeofence, GeofencesState } from '../../../redux/actions/GeofenceActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import requireProjectSelection from '../hocs/RequireProjectSelectionHOC';
import populateGeofencesHOC from '../hocs/PopulateGeofencesHOC';
import populateIntegrationsHOC from '../hocs/PopulateIntegrationsHOC';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import IProject from '../../../models/app/IProject';
const MUIDataTable = require('mui-datatables').default;

interface GeofencesProps {
    geofencesState: GeofencesState;
    addGeofence: (geofence: CircleGeofence | PolygonGeofence) => void;
    push: typeof push;
    selectedProject: IProject;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofences: selectedProjectGeofences(state.geofencesState.geofences, state.selectedProject.name), selectedProject: state.selectedProject };
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
        push: (path: string) => dispatch(push(path)),
    };
};

class Geofences extends React.Component<GeofencesProps> {
    refs: {
        query: HTMLInputElement;
    };

    editGeofence = (rowData: string[]) => {
        this.props.push(`/${this.props.selectedProject.name}/geofences/map/edit?name=${rowData[0]}`);
    };

    redirectToNewGeofenceForm = () => {
        this.props.push(`/${this.props.selectedProject.name}/geofences/map`);
    };

    mapGeofencesToTableGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): Array<Array<string>> {
        const tableGeofences = new Array<Array<string>>();
        if (geofences) {
            geofences.forEach(value => {
                tableGeofences.push([
                    value.externalId,
                    value.description,
                    value.shape == ShapePicker.Circle ? 'Circle' : 'Polygon',
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
