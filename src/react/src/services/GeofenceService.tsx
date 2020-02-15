import RestUtilities, { IRestResponse } from './RestUtilities';
import Geofence from '../models/app/geofences/Geofence';
import PolygonGeofence from '../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../models/app/geofences/CircleGeofence';
import { ShapePicker } from '../redux/actions/GoogleMapsActions';
import CoordinatePair from '../models/app/geofences/CoordinatePair';

export default class GeofenceService {
    async getGeofences(projectName: string): Promise<IRestResponse<Array<CircleGeofence | PolygonGeofence>>> {
        return RestUtilities.get<Array<CircleGeofence | PolygonGeofence>>(`${projectName}/geofences`).then(geofenceResponse => {
            const result = new Array<CircleGeofence | PolygonGeofence>();
            if (geofenceResponse.content) {
                geofenceResponse.content.forEach(v => {
                    switch (v.shape) {
                        case ShapePicker.Circle: {
                            const castedShape = v as CircleGeofence;
                            const circle = new CircleGeofence(
                                castedShape.projectId,
                                castedShape.externalId,
                                castedShape.labels,
                                castedShape.onEnter,
                                castedShape.onExit,
                                castedShape.enabled,
                                castedShape.description,
                                castedShape.integrationIds,
                                [new CoordinatePair(v.coordinates[0].lng, v.coordinates[0].lat)],
                                castedShape.metadata,
                                castedShape.radius
                            );
                            circle.id = castedShape.id;
                            result.push(circle);
                            break;
                        }
                        case ShapePicker.Polygon: {
                            const castedShape = v as PolygonGeofence;
                            const polygon = new PolygonGeofence(
                                castedShape.projectId,
                                castedShape.externalId,
                                castedShape.labels,
                                castedShape.onEnter,
                                castedShape.onExit,
                                castedShape.enabled,
                                castedShape.description,
                                castedShape.integrationIds,
                                castedShape.coordinates,
                                castedShape.metadata
                            );
                            polygon.id = castedShape.id;
                            result.push(castedShape);
                            break;
                        }
                        default:
                            break;
                    }
                });
            }
            return Object.assign({}, geofenceResponse, { content: result } as IRestResponse<Array<CircleGeofence | PolygonGeofence>>) as IRestResponse<
                Array<CircleGeofence | PolygonGeofence>
            >;
        });
    }

    async postGeofence(projectName: string, geofence: Geofence): Promise<IRestResponse<void>> {
        return RestUtilities.post(`${projectName}/geofences`, geofence);
    }
    async putGeofence(projectName: string, id: string, geofence: Geofence): Promise<IRestResponse<void>> {
        return RestUtilities.put(`${projectName}/geofences/${id}`, geofence);
    }
    async deleteGeofence(projectName: string, externalId: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`${projectName}/geofences/${externalId}`);
    }
}
