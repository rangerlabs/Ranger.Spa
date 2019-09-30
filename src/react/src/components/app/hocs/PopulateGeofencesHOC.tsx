import * as React from 'react';
import PolygonGeoFence from '../../../models/app/geofences/PolygonGeoFence';
import { populateGeoFences } from '../../../redux/actions/GeoFenceActions';
import CircleGeoFence from '../../../models/app/geofences/CircleGeoFence';
import { ApplicationState } from '../../../stores';
import GeoFenceService from '../../../services/GeoFenceService';
import { connect } from 'react-redux';
import IProject from '../../../models/app/IProject';

const geoFenceService = new GeoFenceService();

interface PopulateGeofencesComponentProps {
    setGeoFences: (geofences: Array<CircleGeoFence | PolygonGeoFence>) => void;
    selectedProject: IProject;
    geofences: Array<CircleGeoFence | PolygonGeoFence>;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofences: state.geofences, selectedProject: state.selectedProject };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setGeoFences: (geofences: Array<CircleGeoFence | PolygonGeoFence>) => {
            const action = populateGeoFences(geofences);
            dispatch(action);
        },
    };
};

const populateGeofencesHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateGeofencesComponent extends React.Component<PopulateGeofencesComponentProps> {
        componentDidMount() {
            if (this.props.geofences.length === 0) {
                geoFenceService.getGeoFences(this.props.selectedProject.name).then(geoFenceResponse => {
                    this.props.setGeoFences(geoFenceResponse);
                });
            }
        }

        render() {
            return <Component {...(this.props as P)} />;
        }
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(PopulateGeofencesComponent);
};

export default populateGeofencesHOC;
