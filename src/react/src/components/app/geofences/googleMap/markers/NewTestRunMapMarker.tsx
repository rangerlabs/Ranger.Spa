import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import Constants from '../../../../../theme/Constants';

const MapMarkerDarkGreen = require('../../../../../../assets/map-marker-dark-green.png');
const MapMarkerPrimaryGreen = require('../../../../../../assets/map-marker-green.png');
const CircularVertexMarker = require('../../../../../../assets/circle-filled-green.png');

export default class NewTestRunMapMarker {
    polylines = new Array<google.maps.Polyline>();
    testPathMarkers = new Array<google.maps.Marker>();

    setAtEventListener: google.maps.MapsEventListener = undefined;

    public constructor(private map: google.maps.Map, latLngArray: google.maps.LatLng) {
        this.createPolyline(latLngArray);
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
        newPolyline.addListener('click', (e: google.maps.MouseEvent) => {
            this.createPolyline(e.latLng);
        });

        if (this.polylines.length === 0) {
            this.polylines.push(newPolyline);
        } else {
            const lastPolyline = this.polylines[this.polylines.length - 1];
            google.maps.event.clearInstanceListeners(lastPolyline);
            const lastPolylinePath = lastPolyline.getPath();
            lastPolylinePath.push(latLng);
            this.polylines[this.polylines.length - 1].setPath(lastPolylinePath);
            this.polylines.push(newPolyline);
        }

        this.pushManualTestRunMarker(latLng);
    }

    private removePolylineEventListeners() {
        if (this.polylines) {
            this.polylines.forEach((pl) => google.maps.event.clearInstanceListeners(pl));
        }
        if (this.testPathMarkers) {
            this.testPathMarkers.forEach((pm) => {
                this.polylines.forEach((pm) => google.maps.event.clearInstanceListeners(pm));
            });
        }
    }

    private clearPolylinesAndMarkers() {
        if (this.polylines) {
            this.polylines.forEach((pl) => {
                pl.setMap(null);
                pl = undefined;
            });
            this.polylines = undefined;
        }
        if (this.testPathMarkers) {
            this.testPathMarkers.forEach((pm) => {
                pm.setMap(null);
                pm = undefined;
            });
            this.testPathMarkers = undefined;
        }
    }

    public destroy() {
        this.removePolylineEventListeners();
        this.clearPolylinesAndMarkers();
    }

    private pushManualTestRunMarker(latLng: google.maps.LatLng) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: CircularVertexMarker,
        });
        this.testPathMarkers.push(marker);
    }
}
