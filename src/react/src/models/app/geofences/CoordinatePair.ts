export default class CoordinatePair {
    public constructor(public lng: number, public lat: number) {}

    public equals(other: CoordinatePair) {
        let result = false;
        if (other) {
            const thisLatLng = new google.maps.LatLng(this.lat, this.lng);
            const otherLatLng = new google.maps.LatLng(other.lat, other.lng);
            result = thisLatLng.equals(otherLatLng);
        }
        return result;
    }
}
