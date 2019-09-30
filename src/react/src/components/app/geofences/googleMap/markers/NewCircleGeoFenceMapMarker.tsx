import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import Constants from '../../../../../theme/Constants';

const CirclePurple = require('../../../../../../assets/circle-outline-purple.png');
const CircleRed = require('../../../../../../assets/circle-outline-red.png');
const MapMarkerRed = require('../../../../../../assets/map-marker-red.png');
const MapMarkerPurple = require('../../../../../../assets/map-marker-purple.png');

const DEFAULT_RADIUS = 100;

declare global {
    interface Window {
        google: typeof google;
    }
}

export default class NewCircleGeoFenceMapMarker {
    public constructor(
        private map: google.maps.Map,
        latLng: google.maps.LatLng,
        radius: number,
        private openInfoWindow: Function,
        private closeInfoWindow: Function,
        private addCircleGeoFence: (latLng: CoordinatePair, radius: number) => void
    ) {
        this.addCircleGeoFenceMarkers(latLng, radius);
        this.addCircleEventHandlers();
        this.addCircleGeoFence(new CoordinatePair(latLng.lat(), latLng.lng()), radius);
    }

    circleClickMarker: google.maps.Marker = undefined;
    CircleGeoFenceCenterMarker: google.maps.Circle = undefined;
    CircleGeoFenceExtenderMarker: google.maps.Marker = undefined;
    lastGeoFenceExtenderHeading: number = undefined;

    public getCenter = () => {
        return this.CircleGeoFenceCenterMarker.getCenter();
    };

    public getRadius = () => {
        return this.CircleGeoFenceCenterMarker.getRadius();
    };

    private clearCircle = () => {
        if (this.circleClickMarker) {
            this.circleClickMarker.setMap(null);
            this.circleClickMarker = undefined;
        }
        if (this.CircleGeoFenceCenterMarker) {
            this.CircleGeoFenceCenterMarker.setMap(null);
            this.CircleGeoFenceCenterMarker = undefined;
        }
        if (this.CircleGeoFenceExtenderMarker) {
            this.CircleGeoFenceExtenderMarker.setMap(null);
            this.CircleGeoFenceExtenderMarker = undefined;
        }
        this.lastGeoFenceExtenderHeading = undefined;
    };

    addCircleGeoFenceMarkers = (latLng: google.maps.LatLng, radius: number = DEFAULT_RADIUS) => {
        this.circleClickMarker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: MapMarkerPurple,
            animation: google.maps.Animation.BOUNCE,
            draggable: true,
        });
        this.CircleGeoFenceCenterMarker = new google.maps.Circle({
            strokeColor: Constants.PRIMARY_COLOR,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: Constants.PRIMARY_COLOR,
            fillOpacity: 0.2,
            map: this.map,
            center: latLng,
            radius: radius,
            draggable: true,
        });
        this.CircleGeoFenceExtenderMarker = new google.maps.Marker({
            map: this.map,
            position: google.maps.geometry.spherical.computeOffset(this.circleClickMarker.getPosition(), this.CircleGeoFenceCenterMarker.getRadius(), 90),
            icon: CirclePurple,
            draggable: true,
        });
    };

    addCircleEventHandlers() {
        this.circleClickMarker.addListener('click', (e: google.maps.MouseEvent) => {
            this.openInfoWindow();
        });
        this.CircleGeoFenceCenterMarker.addListener('click', (e: google.maps.MouseEvent) => {
            this.openInfoWindow();
        });

        this.CircleGeoFenceCenterMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            e.stop();
            this.circleClickMarker.setIcon(MapMarkerRed);
            this.CircleGeoFenceCenterMarker.setOptions({
                strokeColor: '#e53935',
                fillColor: '#e53935',
            });
        });
        this.CircleGeoFenceExtenderMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            e.stop();
            this.CircleGeoFenceExtenderMarker.setIcon(CircleRed);
        });

        this.CircleGeoFenceCenterMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.circleClickMarker.setIcon(MapMarkerPurple);
            this.CircleGeoFenceCenterMarker.setOptions({
                strokeColor: Constants.PRIMARY_COLOR,
                fillColor: Constants.PRIMARY_COLOR,
            });
        });
        this.CircleGeoFenceExtenderMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.CircleGeoFenceExtenderMarker.setIcon(CirclePurple);
        });

        this.circleClickMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
        this.CircleGeoFenceCenterMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
        this.CircleGeoFenceExtenderMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });

        this.circleClickMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const center = this.circleClickMarker.getPosition();
            const radius = this.CircleGeoFenceCenterMarker.getRadius();
            this.CircleGeoFenceCenterMarker.setCenter(center);
            if (!this.lastGeoFenceExtenderHeading) {
                this.lastGeoFenceExtenderHeading = google.maps.geometry.spherical.computeHeading(center, this.CircleGeoFenceExtenderMarker.getPosition());
            }
            this.CircleGeoFenceExtenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(center, radius, this.lastGeoFenceExtenderHeading));
        });
        this.CircleGeoFenceCenterMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeoFenceCenterMarker.getCenter();
            const radius = this.CircleGeoFenceCenterMarker.getRadius();
            this.circleClickMarker.setPosition(center);

            if (!this.lastGeoFenceExtenderHeading) {
                this.lastGeoFenceExtenderHeading = google.maps.geometry.spherical.computeHeading(center, this.CircleGeoFenceExtenderMarker.getPosition());
            }
            this.CircleGeoFenceExtenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(center, radius, this.lastGeoFenceExtenderHeading));
        });
        this.CircleGeoFenceExtenderMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.CircleGeoFenceCenterMarker.getCenter(),
                this.CircleGeoFenceExtenderMarker.getPosition()
            );
            this.CircleGeoFenceCenterMarker.setRadius(radius);
        });

        this.circleClickMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeoFenceCenterMarker.getCenter();
            this.lastGeoFenceExtenderHeading = undefined;
            const radius = this.CircleGeoFenceCenterMarker.getRadius();
            this.addCircleGeoFence(center.toJSON() as CoordinatePair, radius);
        });
        this.CircleGeoFenceCenterMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeoFenceCenterMarker.getCenter();
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.CircleGeoFenceCenterMarker.getCenter(),
                this.CircleGeoFenceExtenderMarker.getPosition()
            );
            this.lastGeoFenceExtenderHeading = undefined;
            this.addCircleGeoFence(center.toJSON() as CoordinatePair, radius);
        });
        this.CircleGeoFenceExtenderMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeoFenceCenterMarker.getCenter();
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.CircleGeoFenceCenterMarker.getCenter(),
                this.CircleGeoFenceExtenderMarker.getPosition()
            );
            this.addCircleGeoFence(center.toJSON() as CoordinatePair, radius);
        });
    }

    private removeEventListeners() {
        if (this.circleClickMarker) {
            google.maps.event.clearInstanceListeners(this.circleClickMarker);
        }
        if (this.CircleGeoFenceCenterMarker) {
            google.maps.event.clearInstanceListeners(this.CircleGeoFenceCenterMarker);
        }
        if (this.CircleGeoFenceExtenderMarker) {
            google.maps.event.clearInstanceListeners(this.CircleGeoFenceExtenderMarker);
        }
    }

    destroy() {
        this.removeEventListeners();
        this.clearCircle();
    }
}
