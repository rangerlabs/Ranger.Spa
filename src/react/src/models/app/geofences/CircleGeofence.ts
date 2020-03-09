import Geofence from './Geofence';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CoordinatePair from './CoordinatePair';
import CorrelationModel from '../../CorrelationModel';
import DailySchedule from '../../DailySchedule';
import Schedule from '../../Schedule';

export default class CircleGeofence implements Geofence {
    shape: ShapePicker;
    correlationModel: CorrelationModel;
    id: string; //assigned when correlationModel.status is Complete

    public constructor(
        public projectId: string,
        public externalId: string,
        public labels: string[] = [],
        public onEnter: boolean,
        public onExit: boolean,
        public enabled: boolean,
        public description: string,
        public integrationIds: string[] = [],
        public coordinates: Array<CoordinatePair>,
        public metadata: [],
        public radius: number,
        public schedule: Schedule
    ) {
        this.shape = ShapePicker.Circle;
    }
}
