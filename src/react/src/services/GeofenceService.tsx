import RestUtilities, { IRestResponse } from './RestUtilities';
import Geofence from '../models/app/geofences/Geofence';
import PolygonGeofence from '../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../models/app/geofences/CircleGeofence';
import { ShapePicker } from '../redux/actions/GoogleMapsActions';
import CoordinatePair from '../models/app/geofences/CoordinatePair';

export default class GeofenceService {
    async getGeofences(projectName: string): Promise<Array<CircleGeofence | PolygonGeofence>> {
        return RestUtilities.get<Array<CircleGeofence | PolygonGeofence>>(`${projectName}/geofence/all`).then(geofenceResponse => {
            const result = new Array<CircleGeofence | PolygonGeofence>();
            geofenceResponse.content.forEach(v => {
                switch (v.shape) {
                    case ShapePicker.Circle: {
                        const circle = v as CircleGeofence;
                        result.push(
                            new CircleGeofence(
                                circle.projectName,
                                circle.name,
                                circle.labels,
                                circle.onEnter,
                                circle.onExit,
                                circle.enabled,
                                circle.description,
                                circle.integrationIds,
                                [new CoordinatePair(v.coordinates[0].lat, v.coordinates[0].lng)],
                                circle.metadata,
                                circle.radius
                            )
                        );
                        break;
                    }
                    case ShapePicker.Polygon: {
                        const polygon = v as PolygonGeofence;
                        result.push(
                            new PolygonGeofence(
                                polygon.projectName,
                                polygon.name,
                                polygon.labels,
                                polygon.onEnter,
                                polygon.onExit,
                                polygon.enabled,
                                polygon.description,
                                polygon.integrationIds,
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

    async getGeofence(projectName: string, name: string): Promise<IRestResponse<CircleGeofence | PolygonGeofence>> {
        return RestUtilities.get<CircleGeofence | PolygonGeofence>(`${projectName}/geofence?name=${name}`);
    }

    async postGeofence(projectName: string, name: Geofence): Promise<IRestResponse<CircleGeofence | PolygonGeofence>> {
        return RestUtilities.post<CircleGeofence | PolygonGeofence>(`${projectName}/geofence`, name);
    }
}
