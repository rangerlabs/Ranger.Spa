import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import Constants from '../../../../../theme/Constants';

const CirclePurple = require('../../../../../../assets/circle-outline-green.png');
const CircleRed = require('../../../../../../assets/circle-outline-red.png');
const MapMarkerRed = require('../../../../../../assets/map-marker-red.png');
const MapMarkerPurple = require('../../../../../../assets/map-marker-green.png');

const DEFAULT_RADIUS = 100;

declare global {
    interface Window {
        google: typeof google;
    }
}

export default class NewCircleGeofenceMapMarker {
    public constructor(
        private map: google.maps.Map,
        latLng: google.maps.LatLng,
        radius: number,
        private openInfoWindow: Function,
        private closeInfoWindow: Function,
        private addCircleGeofence: (latLng: CoordinatePair, radius: number) => void
    ) {
        this.addCircleGeofenceMarkers(latLng, radius);
        this.addCircleEventHandlers();
        this.addCircleGeofence(new CoordinatePair(latLng.lat(), latLng.lng()), radius);
    }

    circleClickMarker: google.maps.Marker = undefined;
    CircleGeofenceCenterMarker: google.maps.Circle = undefined;
    CircleGeofenceExtenderMarker: google.maps.Marker = undefined;
    lastGeofenceExtenderHeading: number = undefined;

    public getCenter = () => {
        return this.CircleGeofenceCenterMarker.getCenter();
    };

    public getRadius = () => {
        return this.CircleGeofenceCenterMarker.getRadius();
    };

    private clearCircle = () => {
        if (this.circleClickMarker) {
            this.circleClickMarker.setMap(null);
            this.circleClickMarker = undefined;
        }
        if (this.CircleGeofenceCenterMarker) {
            this.CircleGeofenceCenterMarker.setMap(null);
            this.CircleGeofenceCenterMarker = undefined;
        }
        if (this.CircleGeofenceExtenderMarker) {
            this.CircleGeofenceExtenderMarker.setMap(null);
            this.CircleGeofenceExtenderMarker = undefined;
        }
        this.lastGeofenceExtenderHeading = undefined;
    };

    addCircleGeofenceMarkers = (latLng: google.maps.LatLng, radius: number = DEFAULT_RADIUS) => {
        this.circleClickMarker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: MapMarkerPurple,
            animation: google.maps.Animation.BOUNCE,
            draggable: true,
        });
        this.CircleGeofenceCenterMarker = new google.maps.Circle({
            strokeColor: Constants.COLORS.PRIMARY_COLOR,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: Constants.COLORS.PRIMARY_COLOR,
            fillOpacity: 0.2,
            map: this.map,
            center: latLng,
            radius: radius,
            draggable: true,
        });
        this.CircleGeofenceExtenderMarker = new google.maps.Marker({
            map: this.map,
            position: google.maps.geometry.spherical.computeOffset(this.circleClickMarker.getPosition(), this.CircleGeofenceCenterMarker.getRadius(), 90),
            icon: CirclePurple,
            draggable: true,
        });
    };

    addCircleEventHandlers() {
        this.circleClickMarker.addListener('click', (e: google.maps.MouseEvent) => {
            this.openInfoWindow();
        });
        this.CircleGeofenceCenterMarker.addListener('click', (e: google.maps.MouseEvent) => {
            this.openInfoWindow();
        });

        this.CircleGeofenceCenterMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            e.stop();
            this.circleClickMarker.setIcon(MapMarkerRed);
            this.CircleGeofenceCenterMarker.setOptions({
                strokeColor: '#e53935',
                fillColor: '#e53935',
            });
        });
        this.CircleGeofenceExtenderMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            e.stop();
            this.CircleGeofenceExtenderMarker.setIcon(CircleRed);
        });

        this.CircleGeofenceCenterMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.circleClickMarker.setIcon(MapMarkerPurple);
            this.CircleGeofenceCenterMarker.setOptions({
                strokeColor: Constants.COLORS.PRIMARY_COLOR,
                fillColor: Constants.COLORS.PRIMARY_COLOR,
            });
        });
        this.CircleGeofenceExtenderMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.CircleGeofenceExtenderMarker.setIcon(CirclePurple);
        });

        this.circleClickMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
        this.CircleGeofenceCenterMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
        this.CircleGeofenceExtenderMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });

        this.circleClickMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const center = this.circleClickMarker.getPosition();
            const radius = this.CircleGeofenceCenterMarker.getRadius();
            this.CircleGeofenceCenterMarker.setCenter(center);
            if (!this.lastGeofenceExtenderHeading) {
                this.lastGeofenceExtenderHeading = google.maps.geometry.spherical.computeHeading(center, this.CircleGeofenceExtenderMarker.getPosition());
            }
            this.CircleGeofenceExtenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(center, radius, this.lastGeofenceExtenderHeading));
        });
        this.CircleGeofenceCenterMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeofenceCenterMarker.getCenter();
            const radius = this.CircleGeofenceCenterMarker.getRadius();
            this.circleClickMarker.setPosition(center);

            if (!this.lastGeofenceExtenderHeading) {
                this.lastGeofenceExtenderHeading = google.maps.geometry.spherical.computeHeading(center, this.CircleGeofenceExtenderMarker.getPosition());
            }
            this.CircleGeofenceExtenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(center, radius, this.lastGeofenceExtenderHeading));
        });
        this.CircleGeofenceExtenderMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.CircleGeofenceCenterMarker.getCenter(),
                this.CircleGeofenceExtenderMarker.getPosition()
            );
            this.CircleGeofenceCenterMarker.setRadius(radius);
        });

        this.circleClickMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeofenceCenterMarker.getCenter();
            this.lastGeofenceExtenderHeading = undefined;
            const radius = this.CircleGeofenceCenterMarker.getRadius();
            this.addCircleGeofence(center.toJSON() as CoordinatePair, radius);
        });
        this.CircleGeofenceCenterMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeofenceCenterMarker.getCenter();
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.CircleGeofenceCenterMarker.getCenter(),
                this.CircleGeofenceExtenderMarker.getPosition()
            );
            this.lastGeofenceExtenderHeading = undefined;
            this.addCircleGeofence(center.toJSON() as CoordinatePair, radius);
        });
        this.CircleGeofenceExtenderMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeofenceCenterMarker.getCenter();
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.CircleGeofenceCenterMarker.getCenter(),
                this.CircleGeofenceExtenderMarker.getPosition()
            );
            this.addCircleGeofence(center.toJSON() as CoordinatePair, radius);
        });
    }

    private removeEventListeners() {
        if (this.circleClickMarker) {
            google.maps.event.clearInstanceListeners(this.circleClickMarker);
        }
        if (this.CircleGeofenceCenterMarker) {
            google.maps.event.clearInstanceListeners(this.CircleGeofenceCenterMarker);
        }
        if (this.CircleGeofenceExtenderMarker) {
            google.maps.event.clearInstanceListeners(this.CircleGeofenceExtenderMarker);
        }
    }

    destroy() {
        this.removeEventListeners();
        this.clearCircle();
    }
}
