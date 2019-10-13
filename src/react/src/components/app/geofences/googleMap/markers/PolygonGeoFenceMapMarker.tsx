import Constants from '../../../../../theme/Constants';

const MapMarkerPurple = require('../../../../../../assets/map-marker-purple.png');
const MapMarkerRed = require('../../../../../../assets/map-marker-red.png');

export default class PolygonGeofenceMapMarker {
    polygonGeofence: google.maps.Polygon = undefined;
    polygonMarker: google.maps.Marker = undefined;

    public constructor(
        private map: google.maps.Map,
        public id: string,
        private latLngPath: Array<google.maps.LatLng>,
        private onClick: (latLng: google.maps.LatLng, geofenceName: string) => void,
        private drop: boolean = false
    ) {
        this.addPolygonGeofence();
        this.addPolygonGeofenceClickEventListener();
    }

    getMarker() {
        return this.polygonMarker;
    }

    addPolygonGeofence() {
        this.polygonGeofence = new google.maps.Polygon({
            clickable: true,
            strokeColor: Constants.PRIMARY_COLOR,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: Constants.PRIMARY_COLOR,
            fillOpacity: 0.2,
            map: this.map,
            paths: this.latLngPath,
        });
        this.polygonMarker = new google.maps.Marker({
            map: this.map,
            position: this.getPolygonCenter(),
            icon: MapMarkerPurple,
            animation: this.drop ? google.maps.Animation.DROP : null,
        });
    }

    addPolygonGeofenceClickEventListener() {
        this.polygonGeofence.addListener('click', (e: google.maps.MouseEvent) => {
            const valuesLength = this.polygonGeofence.getPath().getLength();
            if (valuesLength >= 3) {
                google.maps.event.trigger(this.map, 'click', e);
            }
        });
        this.polygonMarker.addListener('click', (e: google.maps.MouseEvent) => {
            const valuesLength = this.polygonGeofence.getPath().getLength();
            if (valuesLength >= 3) {
                this.onClick(this.getPolygonCenter(), this.id);
            }
        });
        this.polygonMarker.addListener('mouseover', (e: google.maps.MouseEvent) => {
            this.polygonMarker.setIcon(MapMarkerRed);
        });
        this.polygonMarker.addListener('mouseout', (e: google.maps.MouseEvent) => {
            this.polygonMarker.setIcon(MapMarkerPurple);
        });
        this.polygonGeofence.addListener('mousemove', (e: google.maps.MouseEvent) => {
            google.maps.event.trigger(this.map, 'mousemove', e);
        });
    }

    getPolygonCenter() {
        var bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < this.polygonGeofence.getPath().getLength(); i++) {
            bounds.extend(this.polygonGeofence.getPath().getAt(i));
        }
        return bounds.getCenter();
    }

    private removeEventListeners = () => {
        if (this.polygonGeofence) {
            google.maps.event.clearInstanceListeners(this.polygonGeofence);
        }
        if (this.polygonMarker) {
            google.maps.event.clearInstanceListeners(this.polygonMarker);
        }
    };

    private clearCircle = () => {
        if (this.polygonGeofence) {
            this.polygonGeofence.setMap(null);
            this.polygonGeofence = undefined;
        }
        if (this.polygonMarker) {
            this.polygonMarker.setMap(null);
            this.polygonMarker = undefined;
        }
    };

    public destroy = () => {
        this.removeEventListeners();
        this.clearCircle();
    };
}
