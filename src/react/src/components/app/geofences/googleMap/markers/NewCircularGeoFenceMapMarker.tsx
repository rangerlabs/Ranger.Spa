import CoordinatePair from "../../../../../models/app/geofences/CoordinatePair";

const CirclePurple = require("../../../../../../assets/circle-outline-purple.png");
const CircleRed = require("../../../../../../assets/circle-outline-red.png");
const MapMarkerRed = require("../../../../../../assets/map-marker-red.png");
const MapMarkerPurple = require("../../../../../../assets/map-marker-purple.png");

const DEFAULT_RADIUS = 100;

declare global {
    interface Window {
        google: typeof google;
    }
}

export default class NewCircularGeoFenceMapMarker {
    public constructor(
        private map: google.maps.Map,
        latLng: google.maps.LatLng,
        radius: number,
        private openInfoWindow: Function,
        private closeInfoWindow: Function,
        private addCircularGeoFence: (latLng: CoordinatePair, radius: number) => void
    ) {
        this.addCircularGeoFenceMarkers(latLng, radius);
        this.addCircularEventHandlers();
        this.addCircularGeoFence(new CoordinatePair(latLng.lat(), latLng.lng()), radius);
    }

    circularClickMarker: google.maps.Marker = undefined;
    circularGeoFenceCenterMarker: google.maps.Circle = undefined;
    circularGeoFenceExtenderMarker: google.maps.Marker = undefined;
    lastGeoFenceExtenderHeading: number = undefined;

    public getCenter = () => {
        return this.circularGeoFenceCenterMarker.getCenter();
    };

    public getRadius = () => {
        return this.circularGeoFenceCenterMarker.getRadius();
    };

    private clearCircle = () => {
        if (this.circularClickMarker) {
            this.circularClickMarker.setMap(null);
            this.circularClickMarker = undefined;
        }
        if (this.circularGeoFenceCenterMarker) {
            this.circularGeoFenceCenterMarker.setMap(null);
            this.circularGeoFenceCenterMarker = undefined;
        }
        if (this.circularGeoFenceExtenderMarker) {
            this.circularGeoFenceExtenderMarker.setMap(null);
            this.circularGeoFenceExtenderMarker = undefined;
        }
        this.lastGeoFenceExtenderHeading = undefined;
    };

    addCircularGeoFenceMarkers = (latLng: google.maps.LatLng, radius: number = DEFAULT_RADIUS) => {
        this.circularClickMarker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: MapMarkerPurple,
            animation: google.maps.Animation.BOUNCE,
            draggable: true,
        });
        this.circularGeoFenceCenterMarker = new google.maps.Circle({
            strokeColor: "#7e57c2",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#7e57c2",
            fillOpacity: 0.2,
            map: this.map,
            center: latLng,
            radius: radius,
            draggable: true,
        });
        this.circularGeoFenceExtenderMarker = new google.maps.Marker({
            map: this.map,
            position: google.maps.geometry.spherical.computeOffset(this.circularClickMarker.getPosition(), this.circularGeoFenceCenterMarker.getRadius(), 90),
            icon: CirclePurple,
            draggable: true,
        });
    };

    addCircularEventHandlers() {
        this.circularClickMarker.addListener("click", (e: google.maps.MouseEvent) => {
            this.openInfoWindow();
        });
        this.circularGeoFenceCenterMarker.addListener("click", (e: google.maps.MouseEvent) => {
            this.openInfoWindow();
        });

        this.circularGeoFenceCenterMarker.addListener("mouseover", (e: google.maps.MouseEvent) => {
            e.stop();
            this.circularClickMarker.setIcon(MapMarkerRed);
            this.circularGeoFenceCenterMarker.setOptions({
                strokeColor: "#e53935",
                fillColor: "#e53935",
            });
        });
        this.circularGeoFenceExtenderMarker.addListener("mouseover", (e: google.maps.MouseEvent) => {
            e.stop();
            this.circularGeoFenceExtenderMarker.setIcon(CircleRed);
        });

        this.circularGeoFenceCenterMarker.addListener("mouseout", (e: google.maps.MouseEvent) => {
            this.circularClickMarker.setIcon(MapMarkerPurple);
            this.circularGeoFenceCenterMarker.setOptions({
                strokeColor: "#7e57c2",
                fillColor: "#7e57c2",
            });
        });
        this.circularGeoFenceExtenderMarker.addListener("mouseout", (e: google.maps.MouseEvent) => {
            this.circularGeoFenceExtenderMarker.setIcon(CirclePurple);
        });

        this.circularClickMarker.addListener("dragstart", (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
        this.circularGeoFenceCenterMarker.addListener("dragstart", (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });
        this.circularGeoFenceExtenderMarker.addListener("dragstart", (e: google.maps.MouseEvent) => {
            this.closeInfoWindow();
        });

        this.circularClickMarker.addListener("drag", (e: google.maps.MouseEvent) => {
            const center = this.circularClickMarker.getPosition();
            const radius = this.circularGeoFenceCenterMarker.getRadius();
            this.circularGeoFenceCenterMarker.setCenter(center);
            if (!this.lastGeoFenceExtenderHeading) {
                this.lastGeoFenceExtenderHeading = google.maps.geometry.spherical.computeHeading(center, this.circularGeoFenceExtenderMarker.getPosition());
            }
            this.circularGeoFenceExtenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(center, radius, this.lastGeoFenceExtenderHeading));
        });
        this.circularGeoFenceCenterMarker.addListener("drag", (e: google.maps.MouseEvent) => {
            const center = this.circularGeoFenceCenterMarker.getCenter();
            const radius = this.circularGeoFenceCenterMarker.getRadius();
            this.circularClickMarker.setPosition(center);

            if (!this.lastGeoFenceExtenderHeading) {
                this.lastGeoFenceExtenderHeading = google.maps.geometry.spherical.computeHeading(center, this.circularGeoFenceExtenderMarker.getPosition());
            }
            this.circularGeoFenceExtenderMarker.setPosition(google.maps.geometry.spherical.computeOffset(center, radius, this.lastGeoFenceExtenderHeading));
        });
        this.circularGeoFenceExtenderMarker.addListener("drag", (e: google.maps.MouseEvent) => {
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.circularGeoFenceCenterMarker.getCenter(),
                this.circularGeoFenceExtenderMarker.getPosition()
            );
            this.circularGeoFenceCenterMarker.setRadius(radius);
        });

        this.circularClickMarker.addListener("dragend", (e: google.maps.MouseEvent) => {
            const center = this.circularGeoFenceCenterMarker.getCenter();
            this.lastGeoFenceExtenderHeading = undefined;
            const radius = this.circularGeoFenceCenterMarker.getRadius();
            this.addCircularGeoFence(center.toJSON() as CoordinatePair, radius);
        });
        this.circularGeoFenceCenterMarker.addListener("dragend", (e: google.maps.MouseEvent) => {
            const center = this.circularGeoFenceCenterMarker.getCenter();
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.circularGeoFenceCenterMarker.getCenter(),
                this.circularGeoFenceExtenderMarker.getPosition()
            );
            this.lastGeoFenceExtenderHeading = undefined;
            this.addCircularGeoFence(center.toJSON() as CoordinatePair, radius);
        });
        this.circularGeoFenceExtenderMarker.addListener("dragend", (e: google.maps.MouseEvent) => {
            const center = this.circularGeoFenceCenterMarker.getCenter();
            const radius = google.maps.geometry.spherical.computeDistanceBetween(
                this.circularGeoFenceCenterMarker.getCenter(),
                this.circularGeoFenceExtenderMarker.getPosition()
            );
            this.addCircularGeoFence(center.toJSON() as CoordinatePair, radius);
        });
    }

    private removeEventListeners() {
        if (this.circularClickMarker) {
            google.maps.event.clearInstanceListeners(this.circularClickMarker);
        }
        if (this.circularGeoFenceCenterMarker) {
            google.maps.event.clearInstanceListeners(this.circularGeoFenceCenterMarker);
        }
        if (this.circularGeoFenceExtenderMarker) {
            google.maps.event.clearInstanceListeners(this.circularGeoFenceExtenderMarker);
        }
    }

    destroy() {
        this.removeEventListeners();
        this.clearCircle();
    }
}
