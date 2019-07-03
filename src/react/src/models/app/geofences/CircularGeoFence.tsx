import GeoFence from "./GeoFence";
import { ShapePicker } from "../../../redux/actions/GoogleMapsActions";
import CoordinatePair from "./CoordinatePair";

export default class CircularGeoFence implements GeoFence {
    shape: ShapePicker;
    public constructor(
        public appName: string,
        public integrations: string[] = [],
        public onEnter: boolean,
        public onExit: boolean,
        public name: string,
        public description: string,
        public center: CoordinatePair,
        public radius: number
    ) {
        this.shape = ShapePicker.Circular;
    }
}
