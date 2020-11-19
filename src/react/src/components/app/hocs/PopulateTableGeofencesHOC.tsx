import * as React from 'react';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';
import { GeofencesState, populateTableGeofences } from '../../../redux/actions/GeofenceActions';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import { ApplicationState } from '../../../stores';
import GeofenceService from '../../../services/GeofenceService';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import populateProjectsHOC from './PopulateProjectsHOC';
import Loading from '../../loading/Loading';
import requireProjectSelection from './RequireProjectSelectionHOC';

const geofenceService = new GeofenceService();

interface PopulateGeofencesComponentProps {
    setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>, totalCount: number) => void;
    selectedProject: IProject;
    geofencesState: GeofencesState;
}

interface PopulateGeofencesState {
    wasError: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofencesState: state.geofencesState, selectedProject: state.selectedProject };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>, totalCount: number) => {
            const action = populateTableGeofences(geofences, totalCount);
            dispatch(action);
        },
    };
};

const populateTableGeofencesHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateGeofencesComponent extends React.Component<PopulateGeofencesComponentProps, PopulateGeofencesState> {
        state: PopulateGeofencesState = {
            wasError: false,
        };
        componentDidUpdate(prevProps: PopulateGeofencesComponentProps) {
            if (this.props.selectedProject.name && this.props.selectedProject.name !== prevProps.selectedProject.name) {
                geofenceService.getPaginatedGeofences(this.props.selectedProject.id).then((geofenceResponse) => {
                    if (geofenceResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        var totalCount = Number.parseInt(geofenceResponse.headers.get('x-pagination-totalcount'));
                        this.props.setGeofences(geofenceResponse.result ? geofenceResponse.result : new Array<CircleGeofence | PolygonGeofence>(), totalCount);
                    }
                });
            }
        }

        componentDidMount() {
            if (this.props.selectedProject.name) {
                geofenceService.getPaginatedGeofences(this.props.selectedProject.id).then((geofenceResponse) => {
                    if (geofenceResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        var totalCount = Number.parseInt(geofenceResponse.headers.get('x-pagination-totalcount'));
                        this.props.setGeofences(geofenceResponse.result ? geofenceResponse.result : new Array<CircleGeofence | PolygonGeofence>(), totalCount);
                    }
                });
            }
        }

        render() {
            return !this.state.wasError ? <Component {...(this.props as P)} /> : <Loading wasError={this.state.wasError} />;
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(requireProjectSelection(populateProjectsHOC(PopulateGeofencesComponent)));
};

export default populateTableGeofencesHOC;
