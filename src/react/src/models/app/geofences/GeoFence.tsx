import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';

export default interface GeoFence {
    readonly shape: ShapePicker;
    integrationNames: string[];
    labels: string[];
    name: string;
    description: string;
    onEnter: boolean;
    onExit: boolean;
    enabled: boolean;
    metadata: Map<string, object>;
}
