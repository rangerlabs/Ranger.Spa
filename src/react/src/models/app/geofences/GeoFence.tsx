import { ShapePicker } from "../../../redux/actions/GoogleMapsActions";

export default interface GeoFence {
    readonly shape: ShapePicker;
    integrations: string[];
    appName: string;
    name: string;
    description: string;
    onEnter: boolean;
    onExit: boolean;
}
