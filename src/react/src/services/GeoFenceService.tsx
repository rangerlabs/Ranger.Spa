import RestUtilities, { IRestResponse } from './RestUtilities';
import GeoFence from '../models/app/geofences/GeoFence';
import PolygonGeoFence from '../models/app/geofences/PolygonGeoFence';
import CircleGeoFence from '../models/app/geofences/CircleGeoFence';
import { ShapePicker } from '../redux/actions/GoogleMapsActions';
import CoordinatePair from '../models/app/geofences/CoordinatePair';

export default class GeoFenceService {
    async getGeoFences(projectName: string): Promise<Array<CircleGeoFence | PolygonGeoFence>> {
        return RestUtilities.get<Array<CircleGeoFence | PolygonGeoFence>>(`${projectName}/geofence/all`).then(geoFenceResponse => {
            const result = new Array<CircleGeoFence | PolygonGeoFence>();
            geoFenceResponse.content.forEach(v => {
                switch (v.shape) {
                    case ShapePicker.Circle: {
                        const circle = v as CircleGeoFence;
                        result.push(
                            new CircleGeoFence(
                                circle.projectName,
                                circle.name,
                                circle.labels,
                                circle.onEnter,
                                circle.onExit,
                                circle.enabled,
                                circle.description,
                                circle.integrationNames,
                                [new CoordinatePair(v.coordinates[0].lat, v.coordinates[0].lng)],
                                circle.metadata,
                                circle.radius
                            )
                        );
                        break;
                    }
                    case ShapePicker.Polygon: {
                        const polygon = v as PolygonGeoFence;
                        result.push(
                            new PolygonGeoFence(
                                polygon.projectName,
                                polygon.name,
                                polygon.labels,
                                polygon.onEnter,
                                polygon.onExit,
                                polygon.enabled,
                                polygon.description,
                                polygon.integrationNames,
                                polygon.coordinates,
                                polygon.metadata
                            )
                        );
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
            return result;
        });
    }

    async getGeoFence(projectName: string, name: string): Promise<IRestResponse<CircleGeoFence | PolygonGeoFence>> {
        return RestUtilities.get<CircleGeoFence | PolygonGeoFence>(`${projectName}/geofence?name=${name}`);
    }

    async postGeoFence(projectName: string, name: GeoFence): Promise<IRestResponse<CircleGeoFence | PolygonGeoFence>> {
        return RestUtilities.post<CircleGeoFence | PolygonGeoFence>(`${projectName}/geofence`, name);
    }
}
