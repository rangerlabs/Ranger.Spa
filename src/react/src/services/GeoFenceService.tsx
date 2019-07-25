import RestUtilities, { IRestResponse } from "./RestUtilities";
import GeoFence from "../models/app/geofences/GeoFence";
import PolygonGeoFence from "../models/app/geofences/PolygonGeoFence";
import CircularGeoFence from "../models/app/geofences/CircularGeoFence";
import { ShapePicker } from "../redux/actions/GoogleMapsActions";
import CoordinatePair from "../models/app/geofences/CoordinatePair";

export default class GeoFenceService {
    async getGeoFences(): Promise<Array<CircularGeoFence | PolygonGeoFence>> {
        const result = new Array<CircularGeoFence | PolygonGeoFence>();
        RestUtilities.get<Array<CircularGeoFence | PolygonGeoFence>>("/geofence/all").then(geoFenceResponse => {
            geoFenceResponse.content.forEach(v => {
                switch (v.shape) {
                    case ShapePicker.Circular: {
                        v = v as CircularGeoFence;
                        result.push(
                            new CircularGeoFence(
                                v.appName,
                                v.integrations,
                                v.onEnter,
                                v.onExit,
                                v.name,
                                v.description,
                                new CoordinatePair(v.center.lat, v.center.lng),
                                v.radius
                            )
                        );
                        break;
                    }
                    case ShapePicker.Polygon: {
                        v = v as PolygonGeoFence;
                        result.push(
                            new PolygonGeoFence(
                                v.appName,
                                v.integrations,
                                v.onEnter,
                                v.onExit,
                                v.name,
                                v.description,
                                v.latLngPath.map(v => new CoordinatePair(v.lat, v.lng))
                            )
                        );
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        });
        return result;
    }

    async getGeoFence(name: string): Promise<IRestResponse<CircularGeoFence | PolygonGeoFence>> {
        return RestUtilities.get<CircularGeoFence | PolygonGeoFence>("/geofence?name=" + name);
    }

    async postGeoFence(app: GeoFence): Promise<IRestResponse<CircularGeoFence | PolygonGeoFence>> {
        return RestUtilities.post<CircularGeoFence | PolygonGeoFence>("/geofence", app);
    }
}
