import Geofence from './Geofence';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CoordinatePair from './CoordinatePair';
import CorrelationModel from '../../CorrelationModel';
import Schedule from '../../Schedule';

export default class PolygonGeofence implements Geofence {
    shape: ShapePicker;
    correlationModel: CorrelationModel;
    id: string; //assigned when correlationModel.status is Complete

    public constructor(
        public projectId: string,
        public externalId: string,
        public labels: string[],
        public onEnter: boolean,
        public onDwell: boolean,
        public onExit: boolean,
        public enabled: boolean,
        public description: string,
        public integrationIds: string[] = [],
        public coordinates: Array<CoordinatePair>,
        public metadata: [],
        public schedule?: Schedule,
        public createdDate?: Date,
        public updatedDate?: Date
    ) {
        this.shape = ShapePicker.POLYGON;
    }
}
