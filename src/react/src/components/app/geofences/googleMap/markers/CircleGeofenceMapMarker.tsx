import Constants from '../../../../../theme/Constants';

const MapMarkerPurple = require('../../../../../../assets/map-marker-green.png');
const MapMarkerRed = require('../../../../../../assets/map-marker-red.png');

const DEFAULT_RADIUS = 100;

declare global {
    interface Window {
        google: typeof google;
    }
}

export default class CircleGeofenceMapMarker {
    public constructor(
        private map: google.maps.Map,
        public id: string,
        public latLng: google.maps.LatLng,
        public radius: number,
        private onClick: (latLng: google.maps.LatLng, geofenceName: string) => void,
        private drop: boolean = false
    ) {
        this.addCircleGeofenceMarkers(latLng, radius);
        this.addCircleClickEventHandlers();
    }
    //Markers
    circleClickMarker: google.maps.Marker = undefined;
    circleGeofenceCenterMarker: google.maps.Circle = undefined;

    getMarker() {
        return this.circleClickMarker;
    }

    addCircleGeofenceMarkers = (latLng: google.maps.LatLng, radius: number = DEFAULT_RADIUS) => {
        this.circleClickMarker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: MapMarkerPurple,
            animation: this.drop ? google.maps.Animation.DROP : null,
        });
        this.circleGeofenceCenterMarker = new google.maps.Circle({
            strokeColor: Constants.COLORS.PRIMARY_COLOR,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: Constants.COLORS.PRIMARY_COLOR,
            fillOpacity: 0.2,
            map: this.map,
            center: latLng,
            radius: radius,
        });
    };

    addCircleClickEventHandlers() {
        this.circleClickMarker.addListener('click', (e: google.maps.MouseEvent) => {
            this.onClick(this.circleClickMarker.getPosition(), this.id);
        });
        this.circleGeofenceCenterMarker.addListener('click', (e: google.maps.MouseEvent) => {
            google.maps.event.trigger(this.map, 'click', e);
        });
        this.circleClickMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            this.circleClickMarker.setIcon(MapMarkerRed);
        });
        this.circleClickMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.circleClickMarker.setIcon(MapMarkerPurple);
        });
    }

    private removeEventListeners() {
        if (this.circleClickMarker) {
            google.maps.event.clearInstanceListeners(this.circleClickMarker);
        }
        if (this.circleGeofenceCenterMarker) {
            google.maps.event.clearInstanceListeners(this.circleGeofenceCenterMarker);
        }
    }

    private clearCircle = () => {
        if (this.circleClickMarker) {
            this.circleClickMarker.setMap(null);
            this.circleClickMarker = undefined;
        }
        if (this.circleGeofenceCenterMarker) {
            this.circleGeofenceCenterMarker.setMap(null);
            this.circleGeofenceCenterMarker = undefined;
        }
    };

    public destroy = () => {
        this.removeEventListeners();
        this.clearCircle();
    };
}
