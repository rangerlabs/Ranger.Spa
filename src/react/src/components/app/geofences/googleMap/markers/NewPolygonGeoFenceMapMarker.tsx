import CoordinatePair from "../../../../../models/app/geofences/CoordinatePair";

const MapMarkerRed = require("../../../../../../assets/map-marker-red.png");
const MapMarkerPurple = require("../../../../../../assets/map-marker-purple.png");
const CircleFilledRed = require("../../../../../../assets/circle-filled-red.png");

export default class NewPolygonGeoFenceMapMarker {
    polygonGeoFence: google.maps.Polygon = undefined;
    polygonMarker: google.maps.Marker = undefined;

    polylines = new Array<google.maps.Polyline>();
    polygonPathMarkers = new Array<google.maps.Marker>();

    public constructor(
        private map: google.maps.Map,
        latLngArray: google.maps.LatLng[],
        private addPolygonLatLng: (latLngArray: CoordinatePair[]) => void,
        private openInfoWindow: () => void
    ) {
        if (latLngArray.length > 1) {
            this.addPolygonLatLng(latLngArray.map(v => new CoordinatePair(v.lat(), v.lng())));
            this.addPolygonGeoFence(latLngArray);
            this.setPolygonCenterMarker();
        } else {
            this.createPolyline(latLngArray[0]);
        }
    }

    private addPolygonGeoFence(latLngArray: google.maps.LatLng[]) {
        this.polygonGeoFence = new google.maps.Polygon({
            map: this.map,
            paths: latLngArray,
            clickable: true,
            editable: true,
            draggable: true,
            strokeColor: "#7e57c2",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#7e57c2",
            fillOpacity: 0.3,
        });
        this.polygonGeoFence.addListener("click", e => {
            const valuesLength = this.polygonGeoFence.getPath().getLength();
            if (valuesLength >= 3) {
                this.openInfoWindow();
            }
        });
        this.polygonGeoFence.addListener("mouseover", (e: google.maps.MouseEvent) => {
            if (this.polygonMarker) {
                this.polygonMarker.setIcon(MapMarkerRed);
                this.polygonGeoFence.setOptions({
                    strokeColor: "#e53935",
                    fillColor: "#e53935",
                });
            }
        });
        this.polygonGeoFence.addListener("mouseout", (e: google.maps.MouseEvent) => {
            if (this.polygonMarker) {
                this.polygonMarker.setIcon(MapMarkerPurple);
                this.polygonGeoFence.setOptions({
                    strokeColor: "#7e57c2",
                    fillColor: "#7e57c2",
                });
            }
        });

        const polygonPath = this.polygonGeoFence.getPath();
        polygonPath.addListener("insert_at", e => {
            this.handlePolygonChange();
        });
        polygonPath.addListener("remove_at", e => {
            this.handlePolygonChange();
        });
        polygonPath.addListener("set_at", e => {
            this.handlePolygonChange();
        });
    }

    createPolyline(latLng: google.maps.LatLng): void {
        const newPolyline = new google.maps.Polyline({
            map: this.map,
            strokeColor: "#e53935",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            path: [latLng],
            clickable: true,
        });
        this.map.addListener("mousemove", (e: google.maps.MouseEvent) => {
            const lastPolyline = this.polylines[this.polylines.length - 1];
            lastPolyline.setPath([lastPolyline.getPath().getAt(0), e.latLng]);
        });
        newPolyline.addListener("click", (e: google.maps.MouseEvent) => {
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

        this.pushManualPolygonMarker(latLng);
    }

    private clearPolygon() {
        if (this.polygonGeoFence) {
            this.polygonGeoFence.setMap(null);
            this.polygonGeoFence = undefined;
        }
        if (this.polygonMarker) {
            this.polygonMarker.setMap(null);
            this.polygonMarker = undefined;
        }
    }

    private removePolygonEventListeners() {
        if (this.polygonGeoFence) {
            google.maps.event.clearInstanceListeners(this.polygonGeoFence);
        }
        if (this.polygonMarker) {
            google.maps.event.clearInstanceListeners(this.polygonMarker);
        }
    }

    private removePolylineEventListeners() {
        if (this.polylines) {
            this.polylines.forEach(pl => google.maps.event.clearInstanceListeners(pl));
        }
        if (this.polygonPathMarkers) {
            this.polygonPathMarkers.forEach(pm => {
                this.polylines.forEach(pm => google.maps.event.clearInstanceListeners(pm));
            });
        }
        google.maps.event.clearListeners(this.map, "mousemove");
    }

    private clearPolylinesAndMarkers() {
        if (this.polylines) {
            this.polylines.forEach(pl => {
                pl.setMap(null);
                pl = undefined;
            });
            this.polylines = undefined;
        }
        if (this.polygonPathMarkers) {
            this.polygonPathMarkers.forEach(pm => {
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
        const result = this.polygonGeoFence ? true : false;
        return result;
    }

    private handlePolygonChange() {
        const polyPathArray = this.polygonGeoFence.getPath().getArray();
        const latLngArray = polyPathArray.map(v => new CoordinatePair(v.lat(), v.lng()));
        this.addPolygonLatLng(latLngArray);
        this.setPolygonCenterMarker();
    }

    private setPolygonCenterMarker() {
        if (this.polygonMarker) {
            this.polygonMarker.setPosition(this.getPolygonCenter());
        } else {
            this.polygonMarker = new google.maps.Marker({
                map: this.map,
                position: this.getPolygonCenter(),
                icon: MapMarkerPurple,
                animation: google.maps.Animation.BOUNCE,
            });
        }
    }

    private pushManualPolygonMarker(latLng: google.maps.LatLng) {
        const marker = new google.maps.Marker({
            map: this.map,
            position: latLng,
            icon: CircleFilledRed,
        });
        if (this.polylines.length === 1) {
            marker.setClickable(true);
            marker.addListener("click", (e: google.maps.MouseEvent) => {
                if (this.polylines.length >= 3) {
                    const latLngArray = this.polylines.map(pl => pl.getPath().getAt(0));
                    this.addPolygonGeoFence(latLngArray);
                    this.setPolygonCenterMarker();
                    this.addPolygonLatLng(latLngArray.map(v => new CoordinatePair(v.lat(), v.lng())));
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
        for (let i = 0; i < this.polygonGeoFence.getPath().getLength(); i++) {
            bounds.extend(this.polygonGeoFence.getPath().getAt(i));
        }
        console.log("Center: " + bounds.getCenter());
        return bounds.getCenter();
    }
}
