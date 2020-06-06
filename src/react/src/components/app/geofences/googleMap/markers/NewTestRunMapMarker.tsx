import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import Constants from '../../../../../theme/Constants';

const CircularVertexMarker = require('../../../../../../assets/circle-filled-green.png');

export default class NewTestRunMapMarker {
    polylines = new Array<google.maps.Polyline>();
    testPathMarkers = new Array<google.maps.Marker>();

    setAtEventListener: google.maps.MapsEventListener = undefined;
    onComplete: () => void;

    public constructor(
        private map: google.maps.Map,
        latLngArray: google.maps.LatLng,
        private addTestRunLatLng: (lngLatArray: CoordinatePair[]) => void,
        onComplete: () => void
    ) {
        this.createPolyline(latLngArray);
        this.onComplete = onComplete;
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

        if (this.polylines.length === 10) {
            this.removePolylineEventListeners();
            this.onComplete();
            this.pushManualTestRunMarker(latLng);
            return;
        }
        if (this.polylines.length === 0) {
            this.polylines.push(newPolyline);
        } else {
            const lastPolylinePath = this.polylines[this.polylines.length - 1].getPath();
            lastPolylinePath.push(latLng);
            this.polylines[this.polylines.length - 1].setPath(lastPolylinePath);
            this.polylines.push(newPolyline);
        }

        this.pushManualTestRunMarker(latLng);
        this.addPolyLineArrayToState();
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

    private addPolyLineArrayToState() {
        const lngLatArray = this.polylines.map((pl) => pl.getPath().getAt(0));
        this.addTestRunLatLng(lngLatArray.map((v) => new CoordinatePair(v.lng(), v.lat())));
    }
}
