import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import CorrelationModel from '../../CorrelationModel';

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
    onExit: boolean;
    enabled: boolean;
    metadata: Map<string, object>;
}
