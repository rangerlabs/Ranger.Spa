import CoordinatePair from '../../../../../models/app/geofences/CoordinatePair';
import Constants from '../../../../../theme/Constants';

const HorizontalResizerPrimaryGreen = require('../../../../../../assets/horizontal-resize-primary-green.png');
const HorizontalResizerDarkGreen = require('../../../../../../assets/horizontal-resize-dark-green.png');
const VerticalResizerPrimaryGreen = require('../../../../../../assets/vertical-resize-primary-green.png');
const VerticalResizerDarkGreen = require('../../../../../../assets/vertical-resize-dark-green.png');
const MapMarkerDarkGreen = require('../../../../../../assets/map-marker-dark-green.png');
const MapMarkerPrimaryGreen = require('../../../../../../assets/map-marker-green.png');

const DEFAULT_RADIUS = 100;

export default class NewCircleGeofenceMapMarker {
    public constructor(
        private map: google.maps.Map,
        latLng: google.maps.LatLng,
        radius: number,
        private openInfoWindow: Function,
        private closeInfoWindow: Function,
        private addCircleGeofence: (lngLat: CoordinatePair, radius: number) => void
    ) {
        this.addCircleGeofenceMarkers(latLng, radius);
        this.addCircleEventHandlers();
        this.addCircleGeofence(new CoordinatePair(latLng.lng(), latLng.lat()), radius);
    }

    extenderMarker: google.maps.Marker = undefined;
    circleClickMarker: google.maps.Marker = undefined;
    circleGeofenceCenterMarker: google.maps.Circle = undefined;

    public getCenter = () => {
        return this.circleGeofenceCenterMarker.getCenter();
    };

    public getRadius = () => {
        return this.circleGeofenceCenterMarker.getRadius();
    };

    private clearCircle = () => {
        if (this.circleClickMarker) {
            this.circleClickMarker.setMap(null);
            this.circleClickMarker = undefined;
        }
        if (this.circleGeofenceCenterMarker) {
            this.circleGeofenceCenterMarker.setMap(null);
            this.circleGeofenceCenterMarker = undefined;
        }
        if (this.extenderMarker) {
            this.extenderMarker.setMap(null);
            this.extenderMarker = undefined;
        }
    };

    addCircleGeofenceMarkers = (latLng: google.maps.LatLng, radius: number = DEFAULT_RADIUS) => {
        this.circleClickMarker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: MapMarkerPrimaryGreen,
            animation: google.maps.Animation.BOUNCE,
            draggable: true,
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
            draggable: true,
        });
        this.extenderMarker = new google.maps.Marker({
            map: this.map,
            position: google.maps.geometry.spherical.computeOffset(this.circleClickMarker.getPosition(), this.circleGeofenceCenterMarker.getRadius(), 90),
            icon: VerticalResizerPrimaryGreen,
            draggable: true,
            crossOnDrag: false,
        });
    };

    addCircleEventHandlers() {
        this.clickEvents();
        this.mouseOverEvents();
        this.mouseOutEvents();
        this.dragStartEvents();
        this.dragEvents();
        this.dragEndEvents();
    }

    private clickEvents() {
        this.circleClickMarker.addListener('click', (e: google.maps.MouseEvent) => {
            this.openInfoWindow();
        });
        this.circleGeofenceCenterMarker.addListener('click', (e: google.maps.MouseEvent) => {
            this.openInfoWindow();
        });
    }

    private dragStartEvents() {
        this.circleClickMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
        this.circleGeofenceCenterMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
        this.extenderMarker.addListener('dragstart', (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
    }

    private dragEndEvents() {
        this.circleClickMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.circleGeofenceCenterMarker.getCenter();
            const radius = Math.ceil(this.circleGeofenceCenterMarker.getRadius());
            this.addCircleGeofence(new CoordinatePair(center.lng(), center.lat()), radius);
        });
        this.circleGeofenceCenterMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.circleGeofenceCenterMarker.getCenter();
            const radius = Math.ceil(
                google.maps.geometry.spherical.computeDistanceBetween(this.circleGeofenceCenterMarker.getCenter(), this.extenderMarker.getPosition())
            );
            this.addCircleGeofence(new CoordinatePair(center.lng(), center.lat()), radius);
        });
        this.extenderMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.circleGeofenceCenterMarker.getCenter();
            const radius = Math.ceil(
                google.maps.geometry.spherical.computeDistanceBetween(this.circleGeofenceCenterMarker.getCenter(), this.extenderMarker.getPosition())
            );
            this.extenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(this.circleClickMarker.getPosition(), radius, 90));
            this.addCircleGeofence(new CoordinatePair(center.lng(), center.lat()), radius);
        });
    }

    private dragEvents() {
        this.circleClickMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const center = this.circleClickMarker.getPosition();
            const radius = this.circleGeofenceCenterMarker.getRadius();
            this.circleGeofenceCenterMarker.setCenter(center);
            this.extenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(this.circleClickMarker.getPosition(), radius, 90));
        });
        this.circleGeofenceCenterMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const center = this.circleGeofenceCenterMarker.getCenter();
            const radius = this.circleGeofenceCenterMarker.getRadius();
            this.circleClickMarker.setPosition(center);
            this.extenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(this.circleClickMarker.getPosition(), radius, 90));
        });
        this.extenderMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const radius = Math.ceil(
                google.maps.geometry.spherical.computeDistanceBetween(this.circleGeofenceCenterMarker.getCenter(), this.extenderMarker.getPosition())
            );
            this.extenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(this.circleClickMarker.getPosition(), radius, 90));
            this.circleGeofenceCenterMarker.setRadius(radius);
        });
    }

    private mouseOutEvents() {
        this.circleGeofenceCenterMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.circleClickMarker.setIcon(MapMarkerPrimaryGreen);
            this.circleGeofenceCenterMarker.setOptions({
                strokeColor: Constants.COLORS.PRIMARY_COLOR,
                fillColor: Constants.COLORS.PRIMARY_COLOR,
            });
        });
        this.extenderMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.extenderMarker.setIcon(VerticalResizerPrimaryGreen);
        });
    }

    private mouseOverEvents() {
        this.circleGeofenceCenterMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            e.stop();
            this.circleClickMarker.setIcon(MapMarkerDarkGreen);
            this.circleGeofenceCenterMarker.setOptions({
                strokeColor: Constants.COLORS.MAP_DARK_GREEN,
                fillColor: Constants.COLORS.MAP_DARK_GREEN,
            });
        });
        this.extenderMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            e.stop();
            this.extenderMarker.setIcon(VerticalResizerDarkGreen);
        });
    }

    private removeEventListeners() {
        if (this.circleClickMarker) {
            google.maps.event.clearInstanceListeners(this.circleClickMarker);
        }
        if (this.circleGeofenceCenterMarker) {
            google.maps.event.clearInstanceListeners(this.circleGeofenceCenterMarker);
        }
        if (this.extenderMarker) {
            google.maps.event.clearInstanceListeners(this.extenderMarker);
        }
    }

    destroy() {
        this.removeEventListeners();
        this.clearCircle();
    }
}
