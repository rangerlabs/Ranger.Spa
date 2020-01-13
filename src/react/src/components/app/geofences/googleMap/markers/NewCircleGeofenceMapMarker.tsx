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

    circleClickMarker: google.maps.Marker = undefined;
    CircleGeofenceCenterMarker: google.maps.Circle = undefined;
    CircleGeofenceExtenderMarker: google.maps.Marker = undefined;

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
    };

    addCircleGeofenceMarkers = (latLng: google.maps.LatLng, radius: number = DEFAULT_RADIUS) => {
        this.circleClickMarker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: MapMarkerPrimaryGreen,
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
            icon: VerticalResizerPrimaryGreen,
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
            this.circleClickMarker.setIcon(MapMarkerDarkGreen);
            this.CircleGeofenceCenterMarker.setOptions({
                strokeColor: Constants.COLORS.MAP_DARK_GREEN,
                fillColor: Constants.COLORS.MAP_DARK_GREEN,
            });
        });
        this.CircleGeofenceExtenderMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            e.stop();
            this.CircleGeofenceExtenderMarker.setIcon(VerticalResizerDarkGreen);
        });

        this.CircleGeofenceCenterMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.circleClickMarker.setIcon(MapMarkerPrimaryGreen);
            this.CircleGeofenceCenterMarker.setOptions({
                strokeColor: Constants.COLORS.PRIMARY_COLOR,
                fillColor: Constants.COLORS.PRIMARY_COLOR,
            });
        });
        this.CircleGeofenceExtenderMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.CircleGeofenceExtenderMarker.setIcon(VerticalResizerPrimaryGreen);
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
            const radius = Math.ceil(this.CircleGeofenceCenterMarker.getRadius());
            this.CircleGeofenceCenterMarker.setCenter(center);

            this.CircleGeofenceExtenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(center, radius, 90));
        });
        this.CircleGeofenceCenterMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeofenceCenterMarker.getCenter();
            const radius = Math.ceil(this.CircleGeofenceCenterMarker.getRadius());
            this.circleClickMarker.setPosition(center);

            this.CircleGeofenceExtenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(center, radius, 90));
        });
        this.CircleGeofenceExtenderMarker.addListener('drag', (e: google.maps.MouseEvent) => {
            const radius = Math.ceil(
                google.maps.geometry.spherical.computeDistanceBetween(
                    this.CircleGeofenceCenterMarker.getCenter(),
                    this.CircleGeofenceExtenderMarker.getPosition()
                )
            );
            this.CircleGeofenceCenterMarker.setRadius(radius);
        });

        this.circleClickMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeofenceCenterMarker.getCenter();
            const radius = Math.ceil(this.CircleGeofenceCenterMarker.getRadius());
            this.addCircleGeofence(new CoordinatePair(center.lng(), center.lat()), radius);
        });
        this.CircleGeofenceCenterMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeofenceCenterMarker.getCenter();
            const radius = Math.ceil(
                google.maps.geometry.spherical.computeDistanceBetween(
                    this.CircleGeofenceCenterMarker.getCenter(),
                    this.CircleGeofenceExtenderMarker.getPosition()
                )
            );
            this.addCircleGeofence(new CoordinatePair(center.lng(), center.lat()), radius);
        });
        this.CircleGeofenceExtenderMarker.addListener('dragend', (e: google.maps.MouseEvent) => {
            const center = this.CircleGeofenceCenterMarker.getCenter();
            const radius = Math.ceil(
                google.maps.geometry.spherical.computeDistanceBetween(
                    this.CircleGeofenceCenterMarker.getCenter(),
                    this.CircleGeofenceExtenderMarker.getPosition()
                )
            );
            this.addCircleGeofence(new CoordinatePair(center.lng(), center.lat()), radius);
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
