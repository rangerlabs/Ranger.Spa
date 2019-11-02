import Geofence from './Geofence';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CoordinatePair from './CoordinatePair';

export default class CircleGeofenceRequest implements Geofence {
    shape: ShapePicker;

    public constructor(
        public name: string,
        public labels: string[] = [],
        public onEnter: boolean,
        public onExit: boolean,
        public enabled: boolean,
        public description: string,
        public integrationIds: string[] = [],
        public coordinates: Array<CoordinatePair>,
        public metadata: Map<string, object>,
        public radius: number
    ) {
        this.shape = ShapePicker.Circle;
    }
}
