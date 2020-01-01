import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';

export default interface Geofence {
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
