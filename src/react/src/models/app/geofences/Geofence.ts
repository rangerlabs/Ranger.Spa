import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CorrelationModel from '../../CorrelationModel';
import Schedule from '../../Schedule';

export default interface Geofence {
    correlationModel: CorrelationModel;
    id: string;
    projectId: string;
    externalId: string;
    readonly shape: ShapePicker;
    integrationIds: string[];
    labels: string[];
    description: string;
    onEnter: boolean;
    onDwell: boolean;
    onExit: boolean;
    enabled: boolean;
    metadata: [];
    schedule?: Schedule;
    createdDate?: Date;
    updatedDate?: Date;
}
