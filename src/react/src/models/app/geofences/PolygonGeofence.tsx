import Geofence from './Geofence';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CoordinatePair from './CoordinatePair';

export default class PolygonGeofence implements Geofence {
    shape: ShapePicker;

    public constructor(
        public projectName: string,
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
