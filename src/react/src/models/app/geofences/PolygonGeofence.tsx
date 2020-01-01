import Geofence from './Geofence';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CoordinatePair from './CoordinatePair';

export default class PolygonGeofence implements Geofence {
    shape: ShapePicker;

    public constructor(
        public projectId: string,
        public externalId: string,
        public labels: string[],
        public onEnter: boolean,
        public onExit: boolean,
        public enabled: boolean,
        public description: string,
        public integrationIds: string[] = [],
        public coordinates: Array<CoordinatePair>,
        public metadata: Map<string, object>
    ) {
        this.shape = ShapePicker.Polygon;
    }
}
