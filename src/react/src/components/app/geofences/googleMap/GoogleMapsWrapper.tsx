import * as React from 'react';
import { createStyles, Theme, withStyles, WithStyles, TextField } from '@material-ui/core';
import { render } from 'react-dom';
import GoogleMapsInfoWindow from './GoogleMapsInfoWindow';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores';
import {
    ShapePicker,
    addCircleGeofence,
    addPolygonGeofence,
    clearGeofence,
    selectShapePicker,
    setInfoWindowVisible,
    setCreatingGeofence,
    addTestRun,
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
import { removeMapGeofenceByExternalId, populateMapGeofences, resetMapGeofences } from '../../../../redux/actions/GeofenceActions';
const hash = require('object-hash');
import * as queryString from 'query-string';
import Constants from '../../../../theme/Constants';
import NewTestRunMapMarker from './markers/NewTestRunMapMarker';
import GlobalConfig from '../../../../helpers/GlobalConfig';
import GeofenceService from '../../../../services/GeofenceService';
import IProject from '../../../../models/app/IProject';
import Loading from '../../../loading/Loading';
import GoogleMapsSpeedDial from './GoogleMapsSpeedDial';
import { Subject, Subscription, asapScheduler } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { ThrottleConfig } from 'rxjs/internal/operators/throttle';
const DraggableCursor = require('../../../../../assets/plus-primary.png');

const geofencesService = new GeofenceService();
const DEFAULT_RADIUS = 100;

const styles = (theme: Theme) =>
    createStyles({
        autoComplete: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
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
        '& input + fieldset': {
            boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
        },
    },
})(TextField);

const mapStateToProps = (state: ApplicationState) => {
    return {
        selectedShape: state.googleMaps.selectedShapePicker,
        existingGeofences: state.geofencesState.mapGeofences
            .concat(state.geofencesState.pendingCreation)
            .concat(state.geofencesState.pendingUpdate.map((u) => u.updated)),
        geofenceDrawerOpen: state.geofenceDrawer.isOpen,
        isCreating: state.googleMaps.isCreatingGeofence,
        isPolygonClosed: Boolean(state.googleMaps.polygonGeofence),
        selectedProject: state.selectedProject,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        addCircleGeofence: (lngLat: CoordinatePair, radius: number) => {
            const addCircleGeofenceAction = addCircleGeofence({ center: lngLat, radius: radius });
            dispatch(addCircleGeofenceAction);
        },
        addPolygonLatLngArray: (lngLatArray: CoordinatePair[]) => {
            const addPolygonGeofenceAction = addPolygonGeofence({ coordinatePairArray: lngLatArray });
            dispatch(addPolygonGeofenceAction);
        },
        addTestRunLatLngArray: (lngLatArray: CoordinatePair[]) => {
            const addTestRunAction = addTestRun({ coordinatePairArray: lngLatArray });
            dispatch(addTestRunAction);
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
        removeGeofenceByExternalId: (externalId: string) => {
            const action = removeMapGeofenceByExternalId(externalId);
            dispatch(action);
        },
        setInfoWindowVisible: (isVisible: boolean) => {
            const action = setInfoWindowVisible(isVisible);
            dispatch(action);
        },
        setCreatingGeofence: (isCreating: boolean) => {
            const action = setCreatingGeofence(isCreating);
            dispatch(action);
        },
        setMapGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>) => {
            const action = populateMapGeofences(geofences);
            dispatch(action);
        },
        resetMapGeofences: () => {
            const action = resetMapGeofences();
            dispatch(action);
        },
    };
};

const mergeProps = (stateProps: any, dispatchProps: any, own: any) => ({ ...stateProps, ...dispatchProps, ...own });

interface WrapperProps extends WithStyles<typeof styles> {
    selectedShape: ShapePicker;
    existingGeofences: (CircleGeofence | PolygonGeofence)[];
    geofenceDrawerOpen: boolean;
    push: (path: string) => void;
    addCircleGeofence: (lngLat: CoordinatePair, radius: number) => void;
    addPolygonLatLngArray: (lngLatArray: CoordinatePair[]) => void;
    addTestRunLatLngArray: (lngLatArray: CoordinatePair[]) => void;
    removeMapGeofenceFromState: () => void;
    selectShapePicker: (shape: ShapePicker) => void;
    openDrawer: (geofence?: CircleGeofence | PolygonGeofence) => void;
    closeDrawer: () => void;
    removeGeofenceByExternalId: (name: string) => void;
    mapFullyLoadedCallback: () => void;
    onMapLoad?: (map: google.maps.Map) => void;
    setInfoWindowVisible: (isVisible: boolean) => void;
    setCreatingGeofence: (isCreating: boolean) => void;
    setMapGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>) => void;
    resetMapGeofences: () => void;
    innerRef?: any;
    id: string;
    options: google.maps.MapOptions;
    isCreating: boolean;
    isPolygonClosed: boolean;
    selectedProject: IProject;
}

interface GoogleMapsWrapperState {
    isMapFullyLoaded: boolean;
}

class GoogleMapsWrapper extends React.Component<WrapperProps, GoogleMapsWrapperState> {
    map: google.maps.Map = undefined;
    autoComplete: google.maps.places.Autocomplete = undefined;
    infoWindow: google.maps.InfoWindow = undefined;
    markers: Array<CircleGeofenceMapMarker | PolygonGeofenceMapMarker> = [];
    bounds$: Subject<CoordinatePair[]>;
    subscription: Subscription;

    mapClickListener: google.maps.MapsEventListener = undefined;
    autoCompletePlaceChangedListener: google.maps.MapsEventListener = undefined;

    newCircleGeofenceMapMarker: NewCircleGeofenceMapMarker = undefined;
    newPolygonGeofenceMapMarker: NewPolygonGeofenceMapMarker = undefined;
    newTestRunMapMarker: NewTestRunMapMarker = undefined;

    state = {
        isMapFullyLoaded: false,
    };

    constructor(props: WrapperProps) {
        super(props);
        this.bounds$ = new Subject<CoordinatePair[]>();
    }

    //This side effect is necessary because the user could nagivate away from the map with the drawer open and/or a geofence defined
    componentWillUnmount() {
        this.props.closeDrawer();
        switch (this.props.selectedShape) {
            case ShapePicker.CIRCLE: {
                if (this.newCircleGeofenceMapMarker) {
                    this.clearCircle();
                }
            }
            case ShapePicker.POLYGON: {
                if (this.newPolygonGeofenceMapMarker) {
                    this.clearPolygon();
                }
            }
            case ShapePicker.TESTRUN: {
                if (this.newTestRunMapMarker) {
                    this.clearTestRun();
                }
            }
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    componentDidMount = () => {
        if (!window.google) {
            const mapScript = document.createElement('script');
            const markerScript = document.createElement('script');
            mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GlobalConfig.GOOGLE_MAPS_API_KEY}&libraries=geometry,drawing,places`;
            mapScript.async = true;
            document.body.appendChild(mapScript);
            document.body.appendChild(markerScript);
            mapScript.addEventListener('load', (e) => {
                this.initMap();
            });
        } else {
            this.initMap();
        }
    };

    componentDidUpdate = (prevProps: WrapperProps) => {
        if (this.state.isMapFullyLoaded) {
            if (prevProps.selectedShape !== this.props.selectedShape) {
                if (prevProps.selectedShape === ShapePicker.CIRCLE && this.newCircleGeofenceMapMarker) {
                    this.clearCircle();
                    this.props.closeDrawer();
                } else if (this.newPolygonGeofenceMapMarker) {
                    this.clearPolygon();
                    this.props.closeDrawer();
                }
            }

            if (hash.sha1(prevProps.existingGeofences) !== hash.sha1(this.props.existingGeofences)) {
                const newlyAddedGeofences = this.props.existingGeofences.filter((v) => {
                    return !prevProps.existingGeofences.find((f) => f.externalId === v.externalId);
                });
                const deletedGeofences = prevProps.existingGeofences.filter((v) => {
                    return !this.props.existingGeofences.find((f) => f.externalId === v.externalId);
                });
                if (newlyAddedGeofences && newlyAddedGeofences.length > 0) {
                    this.createGeofenceMarkers(newlyAddedGeofences, true);
                }
                if (deletedGeofences && deletedGeofences.length > 0) {
                    this.removeGeofenceMarkers(deletedGeofences);
                }
            }

            // const params = queryString.parse(window.location.search);
            // const name = params['name'] as string;
            // if (name) {
            //     var geofence = this.props.existingGeofences.find((g) => g.externalId === name);
            //     if (geofence) {
            //         switch (geofence.shape) {
            //             case ShapePicker.CIRCLE: {
            //                 this.editCircleGeofenceMarker(geofence as CircleGeofence);
            //                 break;
            //             }
            //             case ShapePicker.POLYGON: {
            //                 this.editPolygonGeofenceMarker(geofence as PolygonGeofence);
            //                 break;
            //             }
            //         }
            //     }
            // }
        }
    };

    private initMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.initMapLocation(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            }, this.handleLocationError);
        } else {
            return this.handleLocationError();
        }
    };

    private handleLocationError = () => {
        this.initMapLocation(new google.maps.LatLng(40.754932, -73.984016));
    };

    private initMapLocation = (initLocation: google.maps.LatLng) => {
        this.map = new window.google.maps.Map(document.getElementById(this.props.id), {
            ...this.props.options,
            center: initLocation,
            styles: Constants.MAP_MAIN_STYLE,
        });

        google.maps.event.addListenerOnce(this.map, 'idle', () => {
            this.setState({ isMapFullyLoaded: true });
            this.registerBoundsChangeCallback();
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

        this.registerAutoCompleteEventHandler();
        if (this.props.onMapLoad) {
            this.props.onMapLoad(this.map);
        }
    };

    private registerBoundsChangeCallback = () => {
        google.maps.event.addListener(this.map, 'bounds_changed', () => {
            var bounds = this.map.getBounds();
            var northEast = bounds.getNorthEast();
            var southWest = bounds.getSouthWest();
            var boundsArray = new Array<CoordinatePair>(
                new CoordinatePair(northEast.lng(), northEast.lat()),
                new CoordinatePair(southWest.lng(), northEast.lat()),
                new CoordinatePair(southWest.lng(), southWest.lat()),
                new CoordinatePair(northEast.lng(), southWest.lat())
            );
            this.bounds$.next(boundsArray);
            this.setBoundedGeofences();
        });
    };

    private setBoundedGeofences() {
        this.subscription = this.bounds$.pipe(throttleTime(2000, asapScheduler, { trailing: true })).subscribe((boundsArray) => {
            console.log('bounds_changed triggerd');
            geofencesService.getBoundedGeofences(this.props.selectedProject.id, boundsArray).then((response) => {
                if (response.isError) {
                    // if status code is 400 show too many geofences warning
                } else {
                    this.props.setMapGeofences(response.result);
                }
            });
        });
    }

    private initializeEditGeofence(name: string) {
        geofencesService.getGeofence(this.props.selectedProject.id, name).then((geofenceResponse) => {
            if (geofenceResponse.result) {
                if (geofenceResponse.result) {
                    switch (geofenceResponse.result.shape) {
                        case ShapePicker.CIRCLE: {
                            this.map.panTo((geofenceResponse.result as CircleGeofence).coordinates[0]);
                            this.setBoundedGeofences();
                            break;
                        }
                        case ShapePicker.POLYGON: {
                            this.map.panTo(this.getPolygonCenter(geofenceResponse.result as PolygonGeofence));
                            this.setBoundedGeofences();
                            break;
                        }
                    }
                }
            }
        });
    }

    private getPolygonCenter(polygon: PolygonGeofence) {
        var bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < polygon.coordinates.length; i++) {
            bounds.extend(polygon.coordinates[i]);
        }
        return bounds.getCenter();
    }

    private getGeofenceFromStateByName(name: string): CircleGeofence | PolygonGeofence {
        return this.props.existingGeofences.find((marker) => marker.externalId === name);
    }

    private removeGeofenceMarkers(markersForRemoval: (CircleGeofence | PolygonGeofence)[]) {
        if (markersForRemoval) {
            markersForRemoval.forEach((markerToRemove) => {
                const markerIndex = this.markers.findIndex((existingMarker) => {
                    return existingMarker.id === markerToRemove.externalId;
                });
                if (markerIndex >= 0) {
                    this.markers[markerIndex].destroy();
                    this.markers.splice(markerIndex, 1);
                }
            });
        }
    }

    private createGeofenceMarkers(markersForCreation: (CircleGeofence | PolygonGeofence)[], animate: boolean = false) {
        markersForCreation.forEach((geofence) => {
            switch (geofence.shape) {
                case ShapePicker.CIRCLE: {
                    const circleGeofence = geofence as CircleGeofence;
                    const marker = new CircleGeofenceMapMarker(
                        this.map,
                        circleGeofence.externalId,
                        new google.maps.LatLng(circleGeofence.coordinates[0].lat, circleGeofence.coordinates[0].lng),
                        circleGeofence.radius,
                        (latLng: google.maps.LatLng, geofenceName: string) => {
                            if (this.props.isCreating) {
                                if (this.newCircleGeofenceMapMarker) {
                                    this.map.panTo(this.newCircleGeofenceMapMarker.getCenter());
                                } else if (this.newPolygonGeofenceMapMarker && this.props.isPolygonClosed) {
                                    this.map.panTo(this.newPolygonGeofenceMapMarker.getPolygonCenter());
                                } else if (this.newTestRunMapMarker) {
                                    this.map.panTo(this.newTestRunMapMarker.getStartingMarker());
                                }
                            } else {
                                this.props.selectShapePicker(ShapePicker.CIRCLE);
                                this.openInfoWindow(latLng, geofenceName);
                            }
                        },
                        animate
                    );
                    this.markers.push(marker);
                    break;
                }
                case ShapePicker.POLYGON: {
                    const polygonGeofence = geofence as PolygonGeofence;
                    const marker = new PolygonGeofenceMapMarker(
                        this.map,
                        polygonGeofence.externalId,
                        polygonGeofence.coordinates.map((v) => new google.maps.LatLng(v.lat, v.lng)),
                        (latLng: google.maps.LatLng, geofenceName: string) => {
                            if (this.props.isCreating) {
                                if (this.newCircleGeofenceMapMarker) {
                                    this.map.panTo(this.newCircleGeofenceMapMarker.getCenter());
                                } else if (this.newPolygonGeofenceMapMarker && this.props.isPolygonClosed) {
                                    this.map.panTo(this.newPolygonGeofenceMapMarker.getPolygonCenter());
                                } else if (this.newTestRunMapMarker) {
                                    this.map.panTo(this.newTestRunMapMarker.getStartingMarker());
                                }
                            } else {
                                this.props.selectShapePicker(ShapePicker.POLYGON);
                                this.openInfoWindow(latLng, geofenceName);
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

    private registerMapClickHandler = () => {
        this.map.setOptions({ draggableCursor: `url(${DraggableCursor}), auto;` });
        this.props.setCreatingGeofence(true);
        this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
            switch (this.props.selectedShape) {
                case ShapePicker.CIRCLE: {
                    if (this.newCircleGeofenceMapMarker) {
                        this.map.panTo(this.newCircleGeofenceMapMarker.getCenter());
                    } else {
                        this.map.panTo(e.latLng);
                        this.newCircleGeofenceMapMarker = new NewCircleGeofenceMapMarker(this.map, e.latLng, DEFAULT_RADIUS, this.props.addCircleGeofence);
                    }
                    break;
                }
                case ShapePicker.POLYGON: {
                    if (this.newPolygonGeofenceMapMarker) {
                        this.newPolygonGeofenceMapMarker.createPolyline(e.latLng);
                    } else {
                        this.newPolygonGeofenceMapMarker = new NewPolygonGeofenceMapMarker(this.map, [e.latLng], this.props.addPolygonLatLngArray);
                    }
                    break;
                }
                case ShapePicker.TESTRUN: {
                    if (this.newTestRunMapMarker) {
                        this.newTestRunMapMarker.createPolyline(e.latLng);
                    } else {
                        this.newTestRunMapMarker = new NewTestRunMapMarker(this.map, e.latLng, this.props.addTestRunLatLngArray, () => {
                            this.removeMapClickHandler();
                            this.props.openDrawer();
                        });
                    }
                }
            }
        });
    };

    private removeMapClickHandler = () => {
        this.map.setOptions({ draggableCursor: '' });
        google.maps.event.removeListener(this.mapClickListener);
        this.mapClickListener = undefined;
        this.props.setCreatingGeofence(false);
    };

    private removePolylineMapMouseOverListners = () => {
        google.maps.event.clearListeners(this.map, 'mousemove');
    };

    clearCircle = () => {
        this.removeMapClickHandler();
        if (this.newCircleGeofenceMapMarker) {
            this.newCircleGeofenceMapMarker.destroy();
            this.newCircleGeofenceMapMarker = undefined;
        }
        this.props.removeMapGeofenceFromState();
    };

    clearPolygon = () => {
        this.removeMapClickHandler();
        if (this.newPolygonGeofenceMapMarker) {
            this.newPolygonGeofenceMapMarker.destroy();
            this.newPolygonGeofenceMapMarker = undefined;
        }
        this.props.removeMapGeofenceFromState();
    };

    clearTestRun = () => {
        this.removeMapClickHandler();
        if (this.newTestRunMapMarker) {
            this.newTestRunMapMarker.destroy();
            this.newTestRunMapMarker = undefined;
        }
        this.props.removeMapGeofenceFromState();
    };

    private registerAutoCompleteEventHandler() {
        this.autoCompletePlaceChangedListener = this.autoComplete.addListener('place_changed', (e: google.maps.MouseEvent) => {
            switch (this.props.selectedShape) {
                case ShapePicker.CIRCLE: {
                    const place = this.autoComplete.getPlace();
                    if (place.geometry) {
                        if (this.newCircleGeofenceMapMarker) {
                            this.clearCircle();
                            this.props.closeDrawer();
                        }
                        this.map.panTo(place.geometry.location);
                        this.map.setZoom(15);
                    }
                    break;
                }
                case ShapePicker.POLYGON: {
                    const place = this.autoComplete.getPlace();
                    if (place.geometry) {
                        if (this.newPolygonGeofenceMapMarker) {
                            this.clearPolygon();
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

    private closeInfoWindow() {
        if (this.infoWindow) {
            this.infoWindow.close();
            this.props.setInfoWindowVisible(false);
        }
    }

    private openInfoWindow(latLng: google.maps.LatLng, geofenceName?: string) {
        this.map.panTo(latLng);
        this.createInfoWindow(latLng, geofenceName);
    }

    private createInfoWindow = (latLng: google.maps.LatLng, geofenceName?: string) => {
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
            this.infoWindow.addListener('closeclick', () => {
                this.props.setInfoWindowVisible(false);
            });
            this.infoWindow.addListener('domready', () => {
                const geofenceName = this.infoWindow.get('name');
                const geofence = this.props.existingGeofences.find((f) => f.externalId === geofenceName);
                const infoWindow =
                    this.props.selectedShape === ShapePicker.CIRCLE ? (
                        <GoogleMapsInfoWindow
                            name={geofenceName}
                            onEdit={() => {
                                this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map/edit?name=' + geofenceName);
                                this.editCircleGeofenceMarker(geofence as CircleGeofence);
                            }}
                        />
                    ) : (
                        <GoogleMapsInfoWindow
                            name={geofenceName}
                            onEdit={() => {
                                this.props.push('/' + window.location.pathname.split('/')[1] + '/geofences/map/edit?name=' + geofenceName);
                                this.editPolygonGeofenceMarker(geofence as PolygonGeofence);
                            }}
                        />
                    );
                render(infoWindow, document.getElementById('infoWindow'));
                if (this.infoWindow.get('geofenceDrawerOpen')) {
                    const existingMarker = this.getGeofenceFromStateByName(geofenceName) as CircleGeofence;
                    this.props.openDrawer(existingMarker);
                }
                this.removeMapClickHandler();
                this.props.setInfoWindowVisible(true);
            });
        }
        this.infoWindow.open(this.map);
    };

    private editPolygonGeofenceMarker(geofence: PolygonGeofence) {
        this.removeMapClickHandler();
        this.closeInfoWindow();
        this.props.selectShapePicker(ShapePicker.POLYGON);
        this.props.openDrawer(geofence);
        this.props.removeGeofenceByExternalId(geofence.externalId);
        this.newPolygonGeofenceMapMarker = new NewPolygonGeofenceMapMarker(
            this.map,
            geofence.coordinates.map((v) => new google.maps.LatLng(v.lat, v.lng)),
            this.props.addPolygonLatLngArray
        );
    }

    private editCircleGeofenceMarker(geofence: CircleGeofence) {
        this.removeMapClickHandler();
        this.closeInfoWindow();
        this.props.selectShapePicker(ShapePicker.CIRCLE);
        this.props.openDrawer(geofence);
        this.props.removeGeofenceByExternalId(geofence.externalId);
        this.newCircleGeofenceMapMarker = new NewCircleGeofenceMapMarker(
            this.map,
            new google.maps.LatLng(geofence.coordinates[0].lat, geofence.coordinates[0].lng),
            geofence.radius,
            this.props.addCircleGeofence
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <StyledSearchTextField className={classes.autoComplete} id="google-places-search" variant="outlined" fullWidth />
                {!this.state.isMapFullyLoaded && <Loading wasError={false} />}
                <div className={classes.mapContainer} id={this.props.id} />
                {this.state.isMapFullyLoaded && (
                    <React.Fragment>
                        <GoogleMapsSpeedDial
                            map={this.map}
                            mapClick={this.registerMapClickHandler}
                            clearCircle={this.clearCircle}
                            clearPolygon={this.clearPolygon}
                            clearTestRun={this.clearTestRun}
                            onCreate={() => {
                                this.removePolylineMapMouseOverListners();
                                this.removeMapClickHandler();
                                this.props.openDrawer();
                                this.closeInfoWindow();
                            }}
                        />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps, mergeProps, { forwardRef: true })(GoogleMapsWrapper));
