import * as React from 'react';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';
import { populateMapGeofences, GeofencesState } from '../../../redux/actions/GeofenceActions';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import { ApplicationState } from '../../../stores';
import GeofenceService from '../../../services/GeofenceService';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import populateProjectsHOC from './PopulateProjectsHOC';
import Loading from '../../loading/Loading';
import requireProjectSelection from './RequireProjectSelectionHOC';

const geofenceService = new GeofenceService();

interface PopulateMapGeofencesComponentProps {
    setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>) => void;
    selectedProject: IProject;
    geofencesState: GeofencesState;
}

interface PopulateMapGeofencesState {
    wasError: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofencesState: state.geofencesState, selectedProject: state.selectedProject };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>) => {
            const action = populateMapGeofences(geofences);
            dispatch(action);
        },
    };
};

const populateMapGeofencesHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateGeofencesComponent extends React.Component<PopulateMapGeofencesComponentProps, PopulateMapGeofencesState> {
        state: PopulateMapGeofencesState = {
            wasError: false,
        };
        componentDidUpdate(prevProps: PopulateMapGeofencesComponentProps) {
            if (
                !this.props.geofencesState.isMapLoaded &&
                this.props.selectedProject.name &&
                this.props.selectedProject.name !== prevProps.selectedProject.name
            ) {
                geofenceService.getPaginatedGeofences(this.props.selectedProject.id).then((geofenceResponse) => {
                    if (geofenceResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setGeofences(geofenceResponse.result ? geofenceResponse.result : new Array<CircleGeofence | PolygonGeofence>());
                    }
                });
            }
        }

        componentDidMount() {
            if (!this.props.geofencesState.isMapLoaded && this.props.selectedProject.name) {
                geofenceService.getPaginatedGeofences(this.props.selectedProject.id).then((geofenceResponse) => {
                    if (geofenceResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setGeofences(geofenceResponse.result ? geofenceResponse.result : new Array<CircleGeofence | PolygonGeofence>());
                    }
                });
            }
        }

        render() {
            return this.props.geofencesState.isMapLoaded && !this.state.wasError ? (
                <Component {...(this.props as P)} />
            ) : (
                <Loading wasError={this.state.wasError} />
            );
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(requireProjectSelection(populateProjectsHOC(PopulateGeofencesComponent)));
};

export default populateMapGeofencesHOC;
