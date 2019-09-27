import GeoFence from './GeoFence';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CoordinatePair from './CoordinatePair';

export default class PolygonGeoFence implements GeoFence {
    shape: ShapePicker;
    public constructor(
        public appId: string,
        public integrationIds: string[] = [],
        public onEnter: boolean,
        public onExit: boolean,
        public name: string,
        public description: string,
        public latLngPath: Array<CoordinatePair>
    ) {
        this.shape = ShapePicker.Polygon;
    }
}
