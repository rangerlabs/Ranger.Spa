const MapMarkerPurple = require("../../../../../../assets/map-marker-purple.png");
const MapMarkerRed = require("../../../../../../assets/map-marker-red.png");

const DEFAULT_RADIUS = 100;

declare global {
    interface Window {
        google: typeof google;
    }
}

export default class CircularGeoFenceMapMarker {
    public constructor(
        private map: google.maps.Map,
        public name: string,
        public latLng: google.maps.LatLng,
        public radius: number,
        private onClick: (latLng: google.maps.LatLng, geoFenceName: string) => void,
        private drop: boolean = false
    ) {
        this.addCircularGeoFenceMarkers(latLng, radius);
        this.addCircularClickEventHandlers();
    }
    //Markers
    circularClickMarker: google.maps.Marker = undefined;
    circularGeoFenceCenterMarker: google.maps.Circle = undefined;

    addCircularGeoFenceMarkers = (latLng: google.maps.LatLng, radius: number = DEFAULT_RADIUS) => {
        this.circularClickMarker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: MapMarkerPurple,
            animation: this.drop ? google.maps.Animation.DROP : null,
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
        });
    };

    addCircularClickEventHandlers() {
        this.circularClickMarker.addListener("click", (e: google.maps.MouseEvent) => {
            this.onClick(this.circularClickMarker.getPosition(), this.name);
        });
        this.circularGeoFenceCenterMarker.addListener("click", (e: google.maps.MouseEvent) => {
            google.maps.event.trigger(this.map, "click", e);
        });
        this.circularClickMarker.addListener("mouseover", (e: google.maps.MouseEvent) => {
            this.circularClickMarker.setIcon(MapMarkerRed);
        });
        this.circularClickMarker.addListener("mouseout", (e: google.maps.MouseEvent) => {
            this.circularClickMarker.setIcon(MapMarkerPurple);
        });
    }

    private removeEventListeners() {
        if (this.circularClickMarker) {
            google.maps.event.clearInstanceListeners(this.circularClickMarker);
        }
        if (this.circularGeoFenceCenterMarker) {
            google.maps.event.clearInstanceListeners(this.circularGeoFenceCenterMarker);
        }
    }

    private clearCircle = () => {
        if (this.circularClickMarker) {
            this.circularClickMarker.setMap(null);
            this.circularClickMarker = undefined;
        }
        if (this.circularGeoFenceCenterMarker) {
            this.circularGeoFenceCenterMarker.setMap(null);
            this.circularGeoFenceCenterMarker = undefined;
        }
    };

    public destroy = () => {
        this.removeEventListeners();
        this.clearCircle();
    };
}
