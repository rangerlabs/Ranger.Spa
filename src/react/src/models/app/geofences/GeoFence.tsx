import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';

export default interface GeoFence {
    readonly shape: ShapePicker;
    integrationIds: string[];
    appId: string;
    name: string;
    description: string;
    onEnter: boolean;
    onExit: boolean;
}
