import * as React from 'react';
import { createStyles, Theme, withStyles, WithStyles, TextField } from '@material-ui/core';
import { render } from 'react-dom';
import GoogleMapsInfoWindow from './GoogleMapsInfoWindow';
import GoogleMapsShapePicker from './GoogleMapsShapePicker';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores';
import {
    ShapePicker,
    PolygonGeoFenceState,
    CircleGeoFenceState,
    addCircleGeoFence,
    addPolygonGeoFence,
    clearGeoFence,
    selectShapePicker,
} from '../../../../redux/actions/GoogleMapsActions';
import CoordinatePair from '../../../../models/app/geofences/CoordinatePair';
import CircleGeoFence from '../../../../models/app/geofences/CircleGeoFence';
import PolygonGeoFence from '../../../../models/app/geofences/PolygonGeoFence';
import CircleGeoFenceMapMarker from './markers/CircleGeoFenceMapMarker';
import NewCircleGeoFenceMapMarker from './markers/NewCircleGeoFenceMapMarker';
import PolygonGeoFenceMapMarker from './markers/PolygonGeoFenceMapMarker';
import NewPolygonGeoFenceMapMarker from './markers/NewPolygonGeoFenceMapMarker';
import { push } from 'connected-react-router';
import { openGeoFenceDrawer } from '../../../../redux/actions/GeoFenceDrawerActions';
import { closeGeoFenceDrawer } from '../../../../redux/actions/GeoFenceDrawerActions';
import { removeGeoFence } from '../../../../redux/actions/GeoFenceActions';
const MapMarkerPlus = '../../../../../assets/map-marker-plus.png';
const hash = require('object-hash');
import * as queryString from 'query-string';
import styled from 'styled-components';
import Constants from '../../../../theme/Constants';

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

// const StyledSearchTextField = styled(TextField)`
//     .MuiOutlinedInput-root {
//         fieldset {
//             border-top: "0px";
//             border-left: "0px";
//             border-right: "0px";
//             border-radius: "0px";
//         }
//     }
// `;

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedShape: state.googleMaps.selectedShapePicker,
        CircleGeoFence: state.googleMaps.CircleGeoFence,
        polygonGeoFence: state.googleMaps.polygonGeoFence,
        existingGeoFences: selectedProjectGeoFences(state.geofences, state.selectedProject.name),
        geoFenceDrawerOpen: state.geoFenceDrawer.isOpen,
    };
};

const selectedProjectGeoFences = (geofences: (CircleGeoFence | PolygonGeoFence)[], id: string) => {
    return geofences.filter(f => f.projectName === id);
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        addCircleGeoFence: (latLng: CoordinatePair, radius: number) => {
            const addCircleGeoFenceAction = addCircleGeoFence({ center: latLng, radius: radius });
            dispatch(addCircleGeoFenceAction);
        },
        addPolygonLatLngArray: (latLngArray: CoordinatePair[]) => {
            const addPolygonGeoFenceAction = addPolygonGeoFence({ coordinatePairArray: latLngArray });
            dispatch(addPolygonGeoFenceAction);
        },
        removeMapGeoFenceFromState: () => {
            const clearGeoFenceAction = clearGeoFence();
            dispatch(clearGeoFenceAction);
        },
        selectShapePicker: (shape: ShapePicker) => {
            const selectShapePickerAction = selectShapePicker(shape);
            dispatch(selectShapePickerAction);
        },
        openDrawer: (geoFence?: CircleGeoFence | PolygonGeoFence) => {
            const action = openGeoFenceDrawer(geoFence);
            dispatch(action);
        },
        closeDrawer: () => {
            const action = closeGeoFenceDrawer();
            dispatch(action);
        },
        removeGeoFenceFromState: (name: string) => {
            const action = removeGeoFence(name);
            dispatch(action);
        },
    };
};

const mergeProps = (stateProps: any, dispatchProps: any, own: any) => ({ ...stateProps, ...dispatchProps, ...own });
// interface StateProps {
//     selectedShape: ShapePicker;
//     CircleGeoFence: CircleGeoFenceState;
//     polygonGeoFence: PolygonGeoFenceState;
//     existingGeoFences: (CircleGeoFence | PolygonGeoFence)[];
//     geoFenceDrawerOpen: boolean;
// }

// interface DispatchProps {
//     push: (path: string) => void;
//     addCircleGeoFence: (latLng: CoordinatePair, radius: number) => void;
//     addPolygonLatLngArray: (latLngArray: CoordinatePair[]) => void;
//     removeMapGeoFenceFromState: () => void;
//     selectShapePicker: (shape: ShapePicker) => void;
//     openDrawer: (geoFence?: CircleGeoFence | PolygonGeoFence) => void;
//     closeDrawer: () => void;
//     removeGeoFenceFromState: (name: string) => void;
// }

// interface OwnProps extends WithStyles<typeof styles> {
//     mapFullyLoadedCallback: () => void;
//     onMapLoad?: (map: google.maps.Map) => void;
//     innerRef?: any;
//     id: string;
//     options: google.maps.MapOptions;
// }

interface WrapperProps extends WithStyles<typeof styles> {
    selectedShape: ShapePicker;
    CircleGeoFence: CircleGeoFenceState;
    polygonGeoFence: PolygonGeoFenceState;
    existingGeoFences: (CircleGeoFence | PolygonGeoFence)[];
    geoFenceDrawerOpen: boolean;
    push: (path: string) => void;
    addCircleGeoFence: (latLng: CoordinatePair, radius: number) => void;
    addPolygonLatLngArray: (latLngArray: CoordinatePair[]) => void;
    removeMapGeoFenceFromState: () => void;
    selectShapePicker: (shape: ShapePicker) => void;
    openDrawer: (geoFence?: CircleGeoFence | PolygonGeoFence) => void;
    closeDrawer: () => void;
    removeGeoFenceFromState: (name: string) => void;
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
    markers: Array<CircleGeoFenceMapMarker | PolygonGeoFenceMapMarker> = [];

    mapClickListener: google.maps.MapsEventListener = undefined;
    autoCompletePlaceChangedListener: google.maps.MapsEventListener = undefined;

    newCircleGeoFenceMapMarker: NewCircleGeoFenceMapMarker = undefined;
    newPolygonGeoFenceMapMarker: NewPolygonGeoFenceMapMarker = undefined;

    state = {
        isMapFullyLoaded: false,
    };

    componentDidMount = () => {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=geometry,drawing,places`;
            script.async = true;
            document.body.appendChild(script);
            script.addEventListener('load', e => {
                this.onScriptLoad();
            });
        } else {
            this.onScriptLoad();
        }
    };

    componentDidUpdate = (prevProps: WrapperProps) => {
        if (this.state.isMapFullyLoaded) {
            if (prevProps.selectedShape !== this.props.selectedShape) {
                if (prevProps.selectedShape === ShapePicker.Circle && this.newCircleGeoFenceMapMarker) {
                    this.clearCircle();
                    this.props.removeMapGeoFenceFromState();
                    this.props.closeDrawer();
                } else if (this.newPolygonGeoFenceMapMarker) {
                    this.clearPolygon();
                    this.props.removeMapGeoFenceFromState();
                    this.props.closeDrawer();
                }
            }

            if (hash.MD5(prevProps.existingGeoFences) !== hash.MD5(this.props.existingGeoFences)) {
                const newlyAddedGeoFences = this.props.existingGeoFences.filter(v => {
                    return !prevProps.existingGeoFences.find(f => f.name === v.name);
                });
                const deletedGeoFences = prevProps.existingGeoFences.filter(v => {
                    return !this.props.existingGeoFences.find(f => f.name === v.name);
                });
                if (newlyAddedGeoFences && newlyAddedGeoFences.length > 0) {
                    this.createGeoFenceMarkers(newlyAddedGeoFences, true);
                }
                if (deletedGeoFences && deletedGeoFences.length > 0) {
                    this.removeGeoFenceMarkers(deletedGeoFences);
                }
            }
        }
    };

    getInitLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                return new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            }, this.handleLocationError);
        } else {
            return this.handleLocationError();
        }
    }

    handleLocationError() {
        return new google.maps.LatLng(40.754932, -73.984016);
    }

    onScriptLoad = () => {
        this.map = new window.google.maps.Map(document.getElementById(this.props.id), {
            ...this.props.options,
            center: new google.maps.LatLng(40.754932, -73.984016),
            styles: Constants.MAP_MAIN_STYLE,
        });
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
            this.createGeoFenceMarkers(this.props.existingGeoFences, false);
            this.setState({ isMapFullyLoaded: true });
            this.props.mapFullyLoadedCallback();

            const params = queryString.parse(window.location.search);
            const name = params['name'] as string;
            if (name) {
                this.initializeEditGeoFence(name);
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

    private initializeEditGeoFence(name: string) {
        const editGeoFence = this.props.existingGeoFences.find(s => s.name === name);
        if (editGeoFence) {
            switch (editGeoFence.shape) {
                case ShapePicker.Circle: {
                    this.map.panTo((editGeoFence as CircleGeoFence).coordinates[0]);
                    this.editCircleGeoFenceMarker(editGeoFence as CircleGeoFence);
                    break;
                }
                case ShapePicker.Polygon: {
                    this.map.panTo(this.getPolygonCenter(editGeoFence as PolygonGeoFence));
                    this.editPolygonGeoFenceMarker(editGeoFence as PolygonGeoFence);
                    break;
                }
            }
        }
    }

    getPolygonCenter(polygon: PolygonGeoFence) {
        var bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < polygon.coordinates.length; i++) {
            bounds.extend(polygon.coordinates[i]);
        }
        return bounds.getCenter();
    }

    getGeoFenceFromStateByName(name: string): CircleGeoFence | PolygonGeoFence {
        return this.props.existingGeoFences.find(marker => marker.name === name);
    }

    removeGeoFenceMarkers(markersForRemoval: (CircleGeoFence | PolygonGeoFence)[]) {
        if (markersForRemoval) {
            markersForRemoval.forEach(markerToRemove => {
                const markerIndex = this.markers.findIndex(existingMarker => {
                    return existingMarker.id === markerToRemove.name;
                });
                if (markerIndex >= 0) {
                    this.markers[markerIndex].destroy();
                    this.markers.splice(markerIndex, 1);
                }
            });
        }
    }

    createGeoFenceMarkers(markersForCreation: (CircleGeoFence | PolygonGeoFence)[], animate: boolean = false) {
        markersForCreation.forEach((geofence, index) => {
            switch (geofence.shape) {
                case ShapePicker.Circle: {
                    const CircleGeoFence = geofence as CircleGeoFence;
                    const marker = new CircleGeoFenceMapMarker(
                        this.map,
                        CircleGeoFence.name,
                        new google.maps.LatLng(CircleGeoFence.coordinates[0].lat, CircleGeoFence.coordinates[0].lng),
                        CircleGeoFence.radius,
                        (latLng: google.maps.LatLng, geoFenceName: string) => {
                            if (this.newCircleGeoFenceMapMarker) {
                                this.openInfoWindow(this.newCircleGeoFenceMapMarker.getCenter());
                            } else if (this.newPolygonGeoFenceMapMarker) {
                                this.openInfoWindow(this.newPolygonGeoFenceMapMarker.getPolygonCenter());
                            } else {
                                this.props.selectShapePicker(ShapePicker.Circle);
                                this.openInfoWindow(latLng, geoFenceName);
                            }
                        },
                        animate
                    );
                    this.markers.push(marker);
                    break;
                }
                case ShapePicker.Polygon: {
                    const polygonGeoFence = geofence as PolygonGeoFence;
                    const marker = new PolygonGeoFenceMapMarker(
                        this.map,
                        polygonGeoFence.name,
                        polygonGeoFence.coordinates.map(v => new google.maps.LatLng(v.lat, v.lng)),
                        (latLng: google.maps.LatLng, geoFenceName: string) => {
                            if (this.newCircleGeoFenceMapMarker) {
                                this.openInfoWindow(this.newCircleGeoFenceMapMarker.getCenter());
                            } else if (this.newPolygonGeoFenceMapMarker) {
                                this.openInfoWindow(this.newPolygonGeoFenceMapMarker.getPolygonCenter());
                            } else {
                                this.props.selectShapePicker(ShapePicker.Polygon);
                                this.openInfoWindow(latLng, geoFenceName);
                            }
                        },
                        animate
                    );
                    this.markers.push(marker);
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
                    if (this.newCircleGeoFenceMapMarker) {
                        if (!this.props.geoFenceDrawerOpen) {
                            this.openInfoWindow(this.newCircleGeoFenceMapMarker.getCenter());
                        } else {
                            this.map.panTo(this.newCircleGeoFenceMapMarker.getCenter());
                        }
                    } else {
                        this.closeInfoWindow();
                        // this.map.panTo(e.latLng);
                        this.newCircleGeoFenceMapMarker = new NewCircleGeoFenceMapMarker(
                            this.map,
                            e.latLng,
                            DEFAULT_RADIUS,
                            () => {
                                this.openInfoWindow(this.newCircleGeoFenceMapMarker.getCenter());
                            },
                            () => {
                                this.closeInfoWindow();
                            },
                            this.props.addCircleGeoFence
                        );
                        if (this.props.geoFenceDrawerOpen) {
                            this.props.openDrawer();
                        }
                    }
                    break;
                }
                case ShapePicker.Polygon: {
                    if (this.newPolygonGeoFenceMapMarker) {
                        if (this.newPolygonGeoFenceMapMarker.isClosedPolygon()) {
                            this.openInfoWindow(this.newPolygonGeoFenceMapMarker.getPolygonCenter());
                        } else {
                            this.newPolygonGeoFenceMapMarker.createPolyline(e.latLng);
                        }
                    } else {
                        this.closeInfoWindow();
                        this.newPolygonGeoFenceMapMarker = new NewPolygonGeoFenceMapMarker(this.map, [e.latLng], this.props.addPolygonLatLngArray, () => {
                            this.openInfoWindow(this.newPolygonGeoFenceMapMarker.getPolygonCenter());
                        });
                        if (this.props.geoFenceDrawerOpen) {
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
        if (this.newCircleGeoFenceMapMarker) {
            this.newCircleGeoFenceMapMarker.destroy();
            this.newCircleGeoFenceMapMarker = undefined;
        }
        this.closeInfoWindow();
    };

    clearPolygon = () => {
        if (this.newPolygonGeoFenceMapMarker) {
            this.newPolygonGeoFenceMapMarker.destroy();
            this.newPolygonGeoFenceMapMarker = undefined;
        }
        this.closeInfoWindow();
    };

    registerAutoCompleteEventHandler() {
        this.autoCompletePlaceChangedListener = this.autoComplete.addListener('place_changed', (e: google.maps.MouseEvent) => {
            switch (this.props.selectedShape) {
                case ShapePicker.Circle: {
                    const place = this.autoComplete.getPlace();
                    if (place.geometry) {
                        if (this.newCircleGeoFenceMapMarker) {
                            this.clearCircle();
                            this.props.removeMapGeoFenceFromState();
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
                        if (this.newPolygonGeoFenceMapMarker) {
                            this.clearPolygon();
                            this.props.removeMapGeoFenceFromState();
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

    openInfoWindow(latLng: google.maps.LatLng, geoFenceName?: string) {
        this.map.panTo(latLng);
        this.createInfoWindow(latLng, geoFenceName);
    }

    createInfoWindow = (latLng: google.maps.LatLng, geoFenceName?: string) => {
        if (this.infoWindow) {
            this.infoWindow.setPosition(latLng);
            this.infoWindow.set('name', geoFenceName);
            this.infoWindow.set('geoFenceDrawerOpen', this.props.geoFenceDrawerOpen);
        } else {
            this.infoWindow = new window.google.maps.InfoWindow({
                content: '<div id="infoWindow" />',
                position: latLng,
            });
            this.infoWindow.set('name', geoFenceName);
            this.infoWindow.addListener('domready', () => {
                const geoFenceName = this.infoWindow.get('name');
                const geoFence = this.props.existingGeoFences.find(f => f.name === geoFenceName);
                const infoWindow =
                    this.props.selectedShape === ShapePicker.Circle ? (
                        <GoogleMapsInfoWindow
                            name={geoFenceName}
                            clear={() => {
                                this.clearCircle();
                                this.props.removeMapGeoFenceFromState();
                                this.props.closeDrawer();
                            }}
                            onEdit={() => {
                                this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map/edit?name=' + geoFenceName);
                                this.editCircleGeoFenceMarker(geoFence as CircleGeoFence);
                            }}
                            onCreate={() => {
                                this.props.openDrawer();
                                this.closeInfoWindow();
                            }}
                        />
                    ) : (
                        <GoogleMapsInfoWindow
                            name={geoFenceName}
                            clear={() => {
                                this.clearPolygon();
                                this.props.removeMapGeoFenceFromState();
                                this.props.closeDrawer();
                            }}
                            onEdit={() => {
                                this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map/edit?name=' + geoFenceName);
                                this.editPolygonGeoFenceMarker(geoFence as PolygonGeoFence);
                            }}
                            onCreate={() => {
                                this.props.openDrawer();
                                this.closeInfoWindow();
                            }}
                        />
                    );
                render(infoWindow, document.getElementById('infoWindow'));
                if (this.infoWindow.get('geoFenceDrawerOpen')) {
                    const existingMarker = this.getGeoFenceFromStateByName(geoFenceName) as CircleGeoFence;
                    this.props.openDrawer(existingMarker);
                }
            });
        }
        this.infoWindow.open(this.map);
    };

    private editPolygonGeoFenceMarker(geoFence: PolygonGeoFence) {
        this.removeMapClickHandler();
        this.closeInfoWindow();
        this.props.selectShapePicker(ShapePicker.Polygon);
        this.props.openDrawer(geoFence);
        this.props.removeGeoFenceFromState(geoFence.name);
        this.newPolygonGeoFenceMapMarker = new NewPolygonGeoFenceMapMarker(
            this.map,
            geoFence.coordinates.map(v => new google.maps.LatLng(v.lat, v.lng)),
            this.props.addPolygonLatLngArray,
            () => {
                this.openInfoWindow(this.newPolygonGeoFenceMapMarker.getPolygonCenter());
            }
        );
    }

    private editCircleGeoFenceMarker(geoFence: CircleGeoFence) {
        this.removeMapClickHandler();
        this.closeInfoWindow();
        this.props.selectShapePicker(ShapePicker.Circle);
        this.props.openDrawer(geoFence);
        this.props.removeGeoFenceFromState(geoFence.name);
        this.newCircleGeoFenceMapMarker = new NewCircleGeoFenceMapMarker(
            this.map,
            new google.maps.LatLng(geoFence.coordinates[0].lat, geoFence.coordinates[0].lng),
            geoFence.radius,
            () => {},
            () => {
                this.closeInfoWindow();
            },
            this.props.addCircleGeoFence
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <TextField className={classes.autoComplete} id="google-places-search" variant="outlined" fullWidth />
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
