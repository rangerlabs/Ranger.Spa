import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import Constants from '../../../../../theme/Constants';

const MapMarkerDarkGreen = require('../../../../../../assets/map-marker-dark-green.png');
const MapMarkerPrimaryGreen = require('../../../../../../assets/map-marker-green.png');
const CircularVertexMarker = require('../../../../../../assets/circle-filled-green.png');

export default class NewPolygonGeofenceMapMarker {
    polygonGeofence: google.maps.Polygon = undefined;
    polygonMarker: google.maps.Marker = undefined;

    polylines = new Array<google.maps.Polyline>();
    polygonPathMarkers = new Array<google.maps.Marker>();

    setAtEventListener: google.maps.MapsEventListener = undefined;

    public constructor(private map: google.maps.Map, latLngArray: google.maps.LatLng[], private addPolygonLatLng: (lngLatArray: CoordinatePair[]) => void) {
        if (latLngArray.length > 1) {
            this.addPolygonLatLng(latLngArray.map((v) => new CoordinatePair(v.lng(), v.lat())));
            this.addPolygonGeofence(latLngArray);
            this.setPolygonCenterMarker();
        } else {
            this.createPolyline(latLngArray[0]);
        }
    }

    private addPolygonGeofence(latLngArray: google.maps.LatLng[] | google.maps.MVCArray<google.maps.LatLng>) {
        this.polygonGeofence = new google.maps.Polygon({
            map: this.map,
            paths: latLngArray,
            clickable: true,
            editable: true,
            draggable: true,
            geodesic: true,
            strokeColor: Constants.COLORS.PRIMARY_COLOR,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: Constants.COLORS.PRIMARY_COLOR,
            fillOpacity: 0.3,
        });

        this.polygonGeofence.addListener('mouseover', (e: google.maps.MouseEvent) => {
            if (this.polygonMarker) {
                this.polygonMarker.setIcon(MapMarkerDarkGreen);
                this.polygonGeofence.setOptions({
                    strokeColor: Constants.COLORS.MAP_DARK_GREEN,
                    fillColor: Constants.COLORS.MAP_DARK_GREEN,
                });
            }
        });
        this.polygonGeofence.addListener('mouseout', (e: google.maps.MouseEvent) => {
            if (this.polygonMarker) {
                this.polygonMarker.setIcon(MapMarkerPrimaryGreen);
                this.polygonGeofence.setOptions({
                    strokeColor: Constants.COLORS.PRIMARY_COLOR,
                    fillColor: Constants.COLORS.PRIMARY_COLOR,
                });
            }
        });

        const polygonPath = this.polygonGeofence.getPath();
        polygonPath.addListener('insert_at', (e) => {
            this.handlePolygonChange();
        });
        polygonPath.addListener('remove_at', (e) => {
            this.handlePolygonChange();
        });
        this.setAtEventListener = polygonPath.addListener('set_at', (e) => {
            this.handlePolygonChange();
        });
        this.polygonGeofence.addListener('dragend', (e) => {
            this.setAtEventListener = polygonPath.addListener('set_at', (e) => {
                this.handlePolygonChange();
            });
            this.handlePolygonChange();
        });
        this.polygonGeofence.addListener('dragstart', (e) => {
            google.maps.event.removeListener(this.setAtEventListener);
        });
        this.polygonGeofence.addListener('drag', (e) => {
            this.setPolygonCenterMarker();
        });
    }
    createPolyline(latLng: google.maps.LatLng): void {
        const newPolyline = new google.maps.Polyline({
            map: this.map,
            strokeColor: Constants.COLORS.MAP_DARK_GREEN,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            path: [latLng],
            clickable: true,
        });
        this.map.addListener('mousemove', (e: google.maps.MouseEvent) => {
            const lastPolyline = this.polylines[this.polylines.length - 1];
            lastPolyline.setPath([lastPolyline.getPath().getAt(0), e.latLng]);
        });
        newPolyline.addListener('click', (e: google.maps.MouseEvent) => {
            google.maps.event.trigger(this.map, 'click', e);
        });

        if (this.polylines.length === 0) {
            this.polylines.push(newPolyline);
        } else {
            const lastPolylinePath = this.polylines[this.polylines.length - 1].getPath();
            lastPolylinePath.push(latLng);
            this.polylines[this.polylines.length - 1].setPath(lastPolylinePath);
            this.polylines.push(newPolyline);
        }

        this.pushManualPolygonMarker(latLng);
    }

    private clearPolygon() {
        if (this.polygonGeofence) {
            this.polygonGeofence.setMap(null);
            this.polygonGeofence = undefined;
        }
        if (this.polygonMarker) {
            this.polygonMarker.setMap(null);
            this.polygonMarker = undefined;
        }
    }

    private removePolygonEventListeners() {
        if (this.polygonGeofence) {
            google.maps.event.clearInstanceListeners(this.polygonGeofence);
        }
        if (this.polygonMarker) {
            google.maps.event.clearInstanceListeners(this.polygonMarker);
        }
    }

    private removePolylineEventListeners() {
        if (this.polylines) {
            this.polylines.forEach((pl) => google.maps.event.clearInstanceListeners(pl));
        }
        if (this.polygonPathMarkers) {
            this.polygonPathMarkers.forEach((pm) => {
                this.polylines.forEach((pm) => google.maps.event.clearInstanceListeners(pm));
            });
        }
        google.maps.event.clearListeners(this.map, 'mousemove');
    }

    private clearPolylinesAndMarkers() {
        if (this.polylines) {
            this.polylines.forEach((pl) => {
                pl.setMap(null);
                pl = undefined;
            });
            this.polylines = undefined;
        }
        if (this.polygonPathMarkers) {
            this.polygonPathMarkers.forEach((pm) => {
                pm.setMap(null);
                pm = undefined;
            });
            this.polygonPathMarkers = undefined;
        }
    }

    public destroy() {
        this.removePolygonEventListeners();
        this.removePolylineEventListeners();
        this.clearPolygon();
        this.clearPolylinesAndMarkers();
    }

    isClosedPolygon() {
        const result = this.polygonGeofence ? true : false;
        return result;
    }

    private handlePolygonChange() {
        const polyPathArray = this.polygonGeofence.getPath().getArray();
        const lngLatArray = polyPathArray.map((v) => new CoordinatePair(v.lng(), v.lat()));
        this.addPolygonLatLng(lngLatArray);
        this.setPolygonCenterMarker();
    }

    private setPolygonCenterMarker() {
        if (this.polygonMarker) {
            this.polygonMarker.setPosition(this.getPolygonCenter());
        } else {
            this.polygonMarker = new google.maps.Marker({
                map: this.map,
                position: this.getPolygonCenter(),
                icon: MapMarkerPrimaryGreen,
                animation: google.maps.Animation.BOUNCE,
            });
        }
    }

    private pushManualPolygonMarker(latLng: google.maps.LatLng) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: CircularVertexMarker,
        });
        if (this.polylines.length === 1) {
            marker.setClickable(true);
            marker.addListener('click', (e: google.maps.MouseEvent) => {
                if (this.polylines.length >= 3) {
                    const lngLatArray = this.polylines.map((pl) => pl.getPath().getAt(0));
                    this.addPolygonGeofence(lngLatArray);
                    this.setPolygonCenterMarker();
                    this.addPolygonLatLng(lngLatArray.map((v) => new CoordinatePair(v.lng(), v.lat())));
                    this.removePolylineEventListeners();
                    this.clearPolylinesAndMarkers();
                }
            });
        }
        this.polygonPathMarkers.push(marker);
        // this.polyline.setPath(this.polygonPath);
    }

    getPolygonCenter() {
        var bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < this.polygonGeofence.getPath().getLength(); i++) {
            bounds.extend(this.polygonGeofence.getPath().getAt(i));
        }
        return bounds.getCenter();
    }
}
