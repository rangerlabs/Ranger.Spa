import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';

export default interface Geofence {
    readonly shape: ShapePicker;
    integrationIds: string[];
    labels: string[];
    name: string;
    description: string;
    onEnter: boolean;
    onExit: boolean;
    enabled: boolean;
    metadata: Map<string, object>;
}
