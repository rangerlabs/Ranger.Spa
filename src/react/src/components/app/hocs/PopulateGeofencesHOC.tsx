import * as React from 'react';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';
import { populateGeofences, GeofencesState } from '../../../redux/actions/GeofenceActions';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import { ApplicationState } from '../../../stores';
import GeofenceService from '../../../services/GeofenceService';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';
import populateProjectsHOC from './PopulateProjectsHOC';
import Loading from '../loading/Loading';
import requireProjectSelection from './RequireProjectSelectionHOC';

const geofenceService = new GeofenceService();

interface PopulateGeofencesComponentProps {
    setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>) => void;
    selectedProject: IProject;
    geofencesState: GeofencesState;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofencesState: state.geofencesState, selectedProject: state.selectedProject };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>) => {
            const action = populateGeofences(geofences);
            dispatch(action);
        },
    };
};

const populateGeofencesHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateGeofencesComponent extends React.Component<PopulateGeofencesComponentProps> {
        componentDidUpdate(prevProps: PopulateGeofencesComponentProps) {
            if (!this.props.geofencesState.isLoaded && this.props.selectedProject.name && this.props.selectedProject.name !== prevProps.selectedProject.name) {
                geofenceService.getGeofences(this.props.selectedProject.name).then((geofenceResponse) => {
                    if (geofenceResponse) {
                        this.props.setGeofences(geofenceResponse.result ? geofenceResponse.result : new Array<CircleGeofence | PolygonGeofence>());
                    }
                });
            }
        }

        componentDidMount() {
            if (!this.props.geofencesState.isLoaded && this.props.selectedProject.name) {
                geofenceService.getGeofences(this.props.selectedProject.name).then((geofenceResponse) => {
                    if (geofenceResponse) {
                        this.props.setGeofences(geofenceResponse.result ? geofenceResponse.result : new Array<CircleGeofence | PolygonGeofence>());
                    }
                });
            }
        }

        render() {
            return this.props.geofencesState.isLoaded ? <Component {...(this.props as P)} /> : <Loading message="Retrieving geofences." />;
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(requireProjectSelection(populateProjectsHOC(PopulateGeofencesComponent)));
};

export default populateGeofencesHOC;
