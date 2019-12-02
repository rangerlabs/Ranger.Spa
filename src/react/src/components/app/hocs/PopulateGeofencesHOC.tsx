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
        componentDidMount() {
            if (!this.props.geofencesState.isLoaded) {
                geofenceService.getGeofences(this.props.selectedProject.name).then(geofenceResponse => {
                    setTimeout(() => {
                        this.props.setGeofences(geofenceResponse);
                    }, 250);
                });
            }
        }

        render() {
            return this.props.geofencesState.isLoaded ? <Component {...(this.props as P)} /> : <Loading message="Retrieving geofences." />;
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(populateProjectsHOC(PopulateGeofencesComponent));
};

export default populateGeofencesHOC;
