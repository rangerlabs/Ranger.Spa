import * as React from 'react';
import { createStyles, Theme, withStyles, WithStyles, TextField } from '@material-ui/core';
import { render } from 'react-dom';
import GoogleMapsInfoWindow from './GoogleMapsInfoWindow';
import GoogleMapsShapePicker from './GoogleMapsShapePicker';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores';
import {
    ShapePicker,
    PolygonGeofenceState,
    CircleGeofenceState,
    addCircleGeofence,
    addPolygonGeofence,
    clearGeofence,
    selectShapePicker,
} from '../../../../redux/actions/GoogleMapsActions';
import CoordinatePair from '../../../../models/app/geofences/CoordinatePair';
import CircleGeofence from '../../../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../../../models/app/geofences/PolygonGeofence';
import CircleGeofenceMapMarker from './markers/CircleGeofenceMapMarker';
import NewCircleGeofenceMapMarker from './markers/NewCircleGeofenceMapMarker';
import PolygonGeofenceMapMarker from './markers/PolygonGeofenceMapMarker';
import NewPolygonGeofenceMapMarker from './markers/NewPolygonGeofenceMapMarker';
import { push } from 'connected-react-router';
import { openGeofenceDrawer } from '../../../../redux/actions/GeofenceDrawerActions';
import { closeGeofenceDrawer } from '../../../../redux/actions/GeofenceDrawerActions';
import { removeGeofence } from '../../../../redux/actions/GeofenceActions';
const hash = require('object-hash');
import * as queryString from 'query-string';
import Constants from '../../../../theme/Constants';
import Loading from '../../loading/Loading';

declare global {
    interface Window {
        google: typeof google;
    }
}

const DEFAULT_RADIUS = 100;

const styles = (theme: Theme) =>
    createStyles({
        autoComplete: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            borderTop: '0px',
            borderRight: '0px',
            borderLeft: '0px',
            borderRadius: '0px',
        },
        mapContainer: {
            width: '100%',
            height: `calc(100% - ${theme.toolbar.height}px - ${theme.spacing(1)}px)`,
        },
    });

const StyledSearchTextField = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderTop: '0px',
            borderLeft: '0px',
            borderRight: '0px',
            borderRadius: '0px',
        },
    },
})(TextField);

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedShape: state.googleMaps.selectedShapePicker,
        CircleGeofence: state.googleMaps.CircleGeofence,
        polygonGeofence: state.googleMaps.polygonGeofence,
        existingGeofences: selectedProjectGeofences(state.geofencesState.geofences, state.selectedProject.name),
        geofenceDrawerOpen: state.geofenceDrawer.isOpen,
    };
};

const selectedProjectGeofences = (geofences: (CircleGeofence | PolygonGeofence)[], id: string) => {
    return geofences.filter(f => f.projectName === id);
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        addCircleGeofence: (latLng: CoordinatePair, radius: number) => {
            const addCircleGeofenceAction = addCircleGeofence({ center: latLng, radius: radius });
            dispatch(addCircleGeofenceAction);
        },
        addPolygonLatLngArray: (latLngArray: CoordinatePair[]) => {
            const addPolygonGeofenceAction = addPolygonGeofence({ coordinatePairArray: latLngArray });
            dispatch(addPolygonGeofenceAction);
        },
        removeMapGeofenceFromState: () => {
            const clearGeofenceAction = clearGeofence();
            dispatch(clearGeofenceAction);
        },
        selectShapePicker: (shape: ShapePicker) => {
            const selectShapePickerAction = selectShapePicker(shape);
            dispatch(selectShapePickerAction);
        },
        openDrawer: (geofence?: CircleGeofence | PolygonGeofence) => {
            const action = openGeofenceDrawer(geofence);
            dispatch(action);
        },
        closeDrawer: () => {
            const action = closeGeofenceDrawer();
            dispatch(action);
        },
        removeGeofenceFromState: (name: string) => {
            const action = removeGeofence(name);
            dispatch(action);
        },
    };
};

const mergeProps = (stateProps: any, dispatchProps: any, own: any) => ({ ...stateProps, ...dispatchProps, ...own });

interface WrapperProps extends WithStyles<typeof styles> {
    selectedShape: ShapePicker;
    CircleGeofence: CircleGeofenceState;
    polygonGeofence: PolygonGeofenceState;
    existingGeofences: (CircleGeofence | PolygonGeofence)[];
    geofenceDrawerOpen: boolean;
    push: (path: string) => void;
    addCircleGeofence: (latLng: CoordinatePair, radius: number) => void;
    addPolygonLatLngArray: (latLngArray: CoordinatePair[]) => void;
    removeMapGeofenceFromState: () => void;
    selectShapePicker: (shape: ShapePicker) => void;
    openDrawer: (geofence?: CircleGeofence | PolygonGeofence) => void;
    closeDrawer: () => void;
    removeGeofenceFromState: (name: string) => void;
    mapFullyLoadedCallback: () => void;
    onMapLoad?: (map: google.maps.Map) => void;
    innerRef?: any;
    id: string;
    options: google.maps.MapOptions;
}

// type GoogleMapsWrapperProps = OwnProps & StateProps & DispatchProps;

interface GoogleMapsWrapperState {
    isMapFullyLoaded: boolean;
}

class GoogleMapsWrapper extends React.Component<WrapperProps, GoogleMapsWrapperState> {
    map: google.maps.Map = undefined;
    autoComplete: google.maps.places.Autocomplete = undefined;
    infoWindow: google.maps.InfoWindow = undefined;
    markers: Array<CircleGeofenceMapMarker | PolygonGeofenceMapMarker> = [];
    markerClusterer: MarkerClusterer;

    mapClickListener: google.maps.MapsEventListener = undefined;
    autoCompletePlaceChangedListener: google.maps.MapsEventListener = undefined;

    newCircleGeofenceMapMarker: NewCircleGeofenceMapMarker = undefined;
    newPolygonGeofenceMapMarker: NewPolygonGeofenceMapMarker = undefined;

    state = {
        isMapFullyLoaded: false,
    };

    componentDidMount = () => {
        if (!window.google) {
            const mapScript = document.createElement('script');
            const markerScript = document.createElement('script');
            mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=geometry,drawing,places`;
            mapScript.async = true;
            markerScript.src = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js';
            document.body.appendChild(mapScript);
            document.body.appendChild(markerScript);
            mapScript.addEventListener('load', e => {
                this.initMap();
            });
        } else {
            this.initMap();
        }
    };

    componentDidUpdate = (prevProps: WrapperProps) => {
        if (this.state.isMapFullyLoaded) {
            if (prevProps.selectedShape !== this.props.selectedShape) {
                if (prevProps.selectedShape === ShapePicker.Circle && this.newCircleGeofenceMapMarker) {
                    this.clearCircle();
                    this.props.removeMapGeofenceFromState();
                    this.props.closeDrawer();
                } else if (this.newPolygonGeofenceMapMarker) {
                    this.clearPolygon();
                    this.props.removeMapGeofenceFromState();
                    this.props.closeDrawer();
                }
            }

            if (hash.MD5(prevProps.existingGeofences) !== hash.MD5(this.props.existingGeofences)) {
                const newlyAddedGeofences = this.props.existingGeofences.filter(v => {
                    return !prevProps.existingGeofences.find(f => f.name === v.name);
                });
                const deletedGeofences = prevProps.existingGeofences.filter(v => {
                    return !this.props.existingGeofences.find(f => f.name === v.name);
                });
                if (newlyAddedGeofences && newlyAddedGeofences.length > 0) {
                    this.createGeofenceMarkers(newlyAddedGeofences, true);
                }
                if (deletedGeofences && deletedGeofences.length > 0) {
                    this.removeGeofenceMarkers(deletedGeofences);
                }
            }
        }
    };

    initMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.initMapLocation(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            }, this.handleLocationError);
        } else {
            return this.handleLocationError();
        }
    };

    handleLocationError = () => {
        this.initMapLocation(new google.maps.LatLng(40.754932, -73.984016));
    };

    initMapLocation = (initLocation: google.maps.LatLng) => {
        this.map = new window.google.maps.Map(document.getElementById(this.props.id), {
            ...this.props.options,
            center: initLocation,
            styles: Constants.MAP_MAIN_STYLE,
        });
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
            this.initMarkerClusterer();
            this.createGeofenceMarkers(this.props.existingGeofences, false);
            this.setState({ isMapFullyLoaded: true });
            this.props.mapFullyLoadedCallback();

            const params = queryString.parse(window.location.search);
            const name = params['name'] as string;
            if (name) {
                this.initializeEditGeofence(name);
            }
        });

        this.autoComplete = new google.maps.places.Autocomplete(document.getElementById('google-places-search') as HTMLInputElement, {
            types: ['geocode'],
        });

        this.registerEventHandlers();
        if (this.props.onMapLoad) {
            this.props.onMapLoad(this.map);
        }
    };

    private initMarkerClusterer() {
        this.markerClusterer = new MarkerClusterer(this.map, this.markers.map(v => v.getMarker()), {
            averageCenter: true,
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        });
        this.markerClusterer.addListener('click', (e: google.maps.MouseEvent, cluster: Cluster) => {
            if (this.markerClusterer.getZoomOnClick()) {
                this.map.setCenter(cluster.getCenter());
                this.map.setZoom(this.markerClusterer.getMaxZoom() + 1);
                this.map.fitBounds(cluster.getBounds());
            }
            e.stop();
        });
    }

    private initializeEditGeofence(name: string) {
        const editGeofence = this.props.existingGeofences.find(s => s.name === name);
        if (editGeofence) {
            switch (editGeofence.shape) {
                case ShapePicker.Circle: {
                    this.map.panTo((editGeofence as CircleGeofence).coordinates[0]);
                    this.editCircleGeofenceMarker(editGeofence as CircleGeofence);
                    break;
                }
                case ShapePicker.Polygon: {
                    this.map.panTo(this.getPolygonCenter(editGeofence as PolygonGeofence));
                    this.editPolygonGeofenceMarker(editGeofence as PolygonGeofence);
                    break;
                }
            }
        }
    }

    getPolygonCenter(polygon: PolygonGeofence) {
        var bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < polygon.coordinates.length; i++) {
            bounds.extend(polygon.coordinates[i]);
        }
        return bounds.getCenter();
    }

    getGeofenceFromStateByName(name: string): CircleGeofence | PolygonGeofence {
        return this.props.existingGeofences.find(marker => marker.name === name);
    }

    removeGeofenceMarkers(markersForRemoval: (CircleGeofence | PolygonGeofence)[]) {
        if (markersForRemoval) {
            markersForRemoval.forEach(markerToRemove => {
                const markerIndex = this.markers.findIndex(existingMarker => {
                    return existingMarker.id === markerToRemove.name;
                });
                if (markerIndex >= 0) {
                    this.markers[markerIndex].destroy();
                    this.markers.splice(markerIndex, 1);
                    this.markerClusterer.removeMarker(this.markers[markerIndex].getMarker());
                }
            });
        }
    }

    createGeofenceMarkers(markersForCreation: (CircleGeofence | PolygonGeofence)[], animate: boolean = false) {
        markersForCreation.forEach((geofence, index) => {
            switch (geofence.shape) {
                case ShapePicker.Circle: {
                    const CircleGeofence = geofence as CircleGeofence;
                    const marker = new CircleGeofenceMapMarker(
                        this.map,
                        CircleGeofence.name,
                        new google.maps.LatLng(CircleGeofence.coordinates[0].lat, CircleGeofence.coordinates[0].lng),
                        CircleGeofence.radius,
                        (latLng: google.maps.LatLng, geofenceName: string) => {
                            if (this.newCircleGeofenceMapMarker) {
                                this.openInfoWindow(this.newCircleGeofenceMapMarker.getCenter());
                            } else if (this.newPolygonGeofenceMapMarker) {
                                this.openInfoWindow(this.newPolygonGeofenceMapMarker.getPolygonCenter());
                            } else {
                                this.props.selectShapePicker(ShapePicker.Circle);
                                this.openInfoWindow(latLng, geofenceName);
                            }
                        },
                        animate
                    );
                    this.markers.push(marker);
                    this.markerClusterer.addMarker(marker.getMarker());
                    break;
                }
                case ShapePicker.Polygon: {
                    const polygonGeofence = geofence as PolygonGeofence;
                    const marker = new PolygonGeofenceMapMarker(
                        this.map,
                        polygonGeofence.name,
                        polygonGeofence.coordinates.map(v => new google.maps.LatLng(v.lat, v.lng)),
                        (latLng: google.maps.LatLng, geofenceName: string) => {
                            if (this.newCircleGeofenceMapMarker) {
                                this.openInfoWindow(this.newCircleGeofenceMapMarker.getCenter());
                            } else if (this.newPolygonGeofenceMapMarker) {
                                this.openInfoWindow(this.newPolygonGeofenceMapMarker.getPolygonCenter());
                            } else {
                                this.props.selectShapePicker(ShapePicker.Polygon);
                                this.openInfoWindow(latLng, geofenceName);
                            }
                        },
                        animate
                    );
                    this.markers.push(marker);
                    this.markerClusterer.addMarker(marker.getMarker());
                    break;
                }
            }
        });
    }

    registerEventHandlers = () => {
        this.registerMapClickHandler();
        this.registerAutoCompleteEventHandler();
    };

    registerMapClickHandler = () => {
        this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
            switch (this.props.selectedShape) {
                case ShapePicker.Circle: {
                    if (this.newCircleGeofenceMapMarker) {
                        if (!this.props.geofenceDrawerOpen) {
                            this.openInfoWindow(this.newCircleGeofenceMapMarker.getCenter());
                        } else {
                            this.map.panTo(this.newCircleGeofenceMapMarker.getCenter());
                        }
                    } else {
                        this.closeInfoWindow();
                        this.map.panTo(e.latLng);
                        this.map.setZoom(16);
                        this.newCircleGeofenceMapMarker = new NewCircleGeofenceMapMarker(
                            this.map,
                            e.latLng,
                            DEFAULT_RADIUS,
                            () => {
                                this.openInfoWindow(this.newCircleGeofenceMapMarker.getCenter());
                            },
                            () => {
                                this.closeInfoWindow();
                            },
                            this.props.addCircleGeofence
                        );
                        if (this.props.geofenceDrawerOpen) {
                            this.props.openDrawer();
                        }
                    }
                    break;
                }
                case ShapePicker.Polygon: {
                    if (this.newPolygonGeofenceMapMarker) {
                        if (this.newPolygonGeofenceMapMarker.isClosedPolygon()) {
                            this.openInfoWindow(this.newPolygonGeofenceMapMarker.getPolygonCenter());
                        } else {
                            this.newPolygonGeofenceMapMarker.createPolyline(e.latLng);
                        }
                    } else {
                        this.closeInfoWindow();
                        this.map.setZoom(16);
                        this.newPolygonGeofenceMapMarker = new NewPolygonGeofenceMapMarker(this.map, [e.latLng], this.props.addPolygonLatLngArray, () => {
                            this.openInfoWindow(this.newPolygonGeofenceMapMarker.getPolygonCenter());
                        });
                        if (this.props.geofenceDrawerOpen) {
                            this.props.openDrawer();
                        }
                    }
                    break;
                }
            }
        });
    };

    removeMapClickHandler = () => {
        google.maps.event.clearInstanceListeners(this.map);
    };

    clearCircle = () => {
        if (this.newCircleGeofenceMapMarker) {
            this.newCircleGeofenceMapMarker.destroy();
            this.newCircleGeofenceMapMarker = undefined;
        }
        this.closeInfoWindow();
    };

    clearPolygon = () => {
        if (this.newPolygonGeofenceMapMarker) {
            this.newPolygonGeofenceMapMarker.destroy();
            this.newPolygonGeofenceMapMarker = undefined;
        }
        this.closeInfoWindow();
    };

    registerAutoCompleteEventHandler() {
        this.autoCompletePlaceChangedListener = this.autoComplete.addListener('place_changed', (e: google.maps.MouseEvent) => {
            switch (this.props.selectedShape) {
                case ShapePicker.Circle: {
                    const place = this.autoComplete.getPlace();
                    if (place.geometry) {
                        if (this.newCircleGeofenceMapMarker) {
                            this.clearCircle();
                            this.props.removeMapGeofenceFromState();
                            this.props.closeDrawer();
                        }
                        this.map.panTo(place.geometry.location);
                        this.map.setZoom(15);
                    }
                    break;
                }
                case ShapePicker.Polygon: {
                    const place = this.autoComplete.getPlace();
                    if (place.geometry) {
                        if (this.newPolygonGeofenceMapMarker) {
                            this.clearPolygon();
                            this.props.removeMapGeofenceFromState();
                            this.props.closeDrawer();
                        }
                        this.map.panTo(place.geometry.location);
                        this.map.setZoom(15);
                    }
                    break;
                }
            }
        });
    }

    closeInfoWindow() {
        if (this.infoWindow) {
            this.infoWindow.close();
        }
    }

    openInfoWindow(latLng: google.maps.LatLng, geofenceName?: string) {
        this.map.panTo(latLng);
        this.createInfoWindow(latLng, geofenceName);
    }

    createInfoWindow = (latLng: google.maps.LatLng, geofenceName?: string) => {
        if (this.infoWindow) {
            this.infoWindow.setPosition(latLng);
            this.infoWindow.set('name', geofenceName);
            this.infoWindow.set('geofenceDrawerOpen', this.props.geofenceDrawerOpen);
        } else {
            this.infoWindow = new window.google.maps.InfoWindow({
                content: '<div id="infoWindow" />',
                position: latLng,
            });
            this.infoWindow.set('name', geofenceName);
            this.infoWindow.addListener('domready', () => {
                const geofenceName = this.infoWindow.get('name');
                const geofence = this.props.existingGeofences.find(f => f.name === geofenceName);
                const infoWindow =
                    this.props.selectedShape === ShapePicker.Circle ? (
                        <GoogleMapsInfoWindow
                            name={geofenceName}
                            clear={() => {
                                this.clearCircle();
                                this.props.removeMapGeofenceFromState();
                                this.props.closeDrawer();
                            }}
                            onEdit={() => {
                                this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map/edit?name=' + geofenceName);
                                this.editCircleGeofenceMarker(geofence as CircleGeofence);
                            }}
                            onCreate={() => {
                                this.props.openDrawer();
                                this.closeInfoWindow();
                            }}
                        />
                    ) : (
                        <GoogleMapsInfoWindow
                            name={geofenceName}
                            clear={() => {
                                this.clearPolygon();
                                this.props.removeMapGeofenceFromState();
                                this.props.closeDrawer();
                            }}
                            onEdit={() => {
                                this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map/edit?name=' + geofenceName);
                                this.editPolygonGeofenceMarker(geofence as PolygonGeofence);
                            }}
                            onCreate={() => {
                                this.props.openDrawer();
                                this.closeInfoWindow();
                            }}
                        />
                    );
                render(infoWindow, document.getElementById('infoWindow'));
                if (this.infoWindow.get('geofenceDrawerOpen')) {
                    const existingMarker = this.getGeofenceFromStateByName(geofenceName) as CircleGeofence;
                    this.props.openDrawer(existingMarker);
                }
            });
        }
        this.infoWindow.open(this.map);
    };

    private editPolygonGeofenceMarker(geofence: PolygonGeofence) {
        this.removeMapClickHandler();
        this.closeInfoWindow();
        this.props.selectShapePicker(ShapePicker.Polygon);
        this.props.openDrawer(geofence);
        this.props.removeGeofenceFromState(geofence.name);
        this.newPolygonGeofenceMapMarker = new NewPolygonGeofenceMapMarker(
            this.map,
            geofence.coordinates.map(v => new google.maps.LatLng(v.lat, v.lng)),
            this.props.addPolygonLatLngArray,
            () => {
                this.openInfoWindow(this.newPolygonGeofenceMapMarker.getPolygonCenter());
            }
        );
    }

    private editCircleGeofenceMarker(geofence: CircleGeofence) {
        this.removeMapClickHandler();
        this.closeInfoWindow();
        this.props.selectShapePicker(ShapePicker.Circle);
        this.props.openDrawer(geofence);
        this.props.removeGeofenceFromState(geofence.name);
        this.newCircleGeofenceMapMarker = new NewCircleGeofenceMapMarker(
            this.map,
            new google.maps.LatLng(geofence.coordinates[0].lat, geofence.coordinates[0].lng),
            geofence.radius,
            () => {},
            () => {
                this.closeInfoWindow();
            },
            this.props.addCircleGeofence
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <StyledSearchTextField className={classes.autoComplete} id="google-places-search" variant="outlined" fullWidth />
                {this.state.isMapFullyLoaded !== true && <Loading message="Initializing map." />}
                <div className={classes.mapContainer} id={this.props.id} />
                {this.state.isMapFullyLoaded && <GoogleMapsShapePicker map={this.map} />}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
        { forwardRef: true }
    )(GoogleMapsWrapper)
);
