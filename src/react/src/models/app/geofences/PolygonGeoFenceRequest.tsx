import GeoFence from './GeoFence';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CoordinatePair from './CoordinatePair';

export default class PolygonGeoFenceRequest implements GeoFence {
    shape: ShapePicker;

    public constructor(
        public name: string,
        public labels: string[],
        public onEnter: boolean,
        public onExit: boolean,
        public enabled: boolean,
        public description: string,
        public integrationNames: string[] = [],
        public coordinates: Array<CoordinatePair>,
        public metadata: Map<string, object>
    ) {
        this.shape = ShapePicker.Polygon;
    }
}
