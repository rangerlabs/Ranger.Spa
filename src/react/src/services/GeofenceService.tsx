import RestUtilities, { IRestResponse } from './RestUtilities';
import Geofence from '../models/app/geofences/Geofence';
import PolygonGeofence from '../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../models/app/geofences/CircleGeofence';
import { ShapePicker } from '../redux/actions/GoogleMapsActions';
import CoordinatePair from '../models/app/geofences/CoordinatePair';
import Schedule from '../models/Schedule';

export default class GeofenceService {
    async getGeofences(projectName: string): Promise<IRestResponse<Array<CircleGeofence | PolygonGeofence>>> {
        return RestUtilities.get<Array<CircleGeofence | PolygonGeofence>>(`${projectName}/geofences`).then((geofenceResponse) => {
            const result = new Array<CircleGeofence | PolygonGeofence>();
            if (geofenceResponse.result) {
                geofenceResponse.result.forEach((v) => {
                    switch (v.shape) {
                        case ShapePicker.CIRCLE: {
                            const castedShape = v as CircleGeofence;
                            const circle = new CircleGeofence(
                                castedShape.projectId,
                                castedShape.externalId,
                                castedShape.labels,
                                castedShape.onEnter,
                                castedShape.onDwell,
                                castedShape.onExit,
                                castedShape.enabled,
                                castedShape.description,
                                castedShape.integrationIds,
                                [new CoordinatePair(v.coordinates[0].lng, v.coordinates[0].lat)],
                                castedShape.metadata,
                                castedShape.radius,
                                castedShape.schedule ? Schedule.CreateIsoScheduleFromResponse(castedShape.schedule) : Schedule.FullUtcSchedule()
                            );
                            circle.id = castedShape.id;
                            result.push(circle);
                            break;
                        }
                        case ShapePicker.POLYGON: {
                            const castedShape = v as PolygonGeofence;
                            const polygon = new PolygonGeofence(
                                castedShape.projectId,
                                castedShape.externalId,
                                castedShape.labels,
                                castedShape.onEnter,
                                castedShape.onDwell,
                                castedShape.onExit,
                                castedShape.enabled,
                                castedShape.description,
                                castedShape.integrationIds,
                                castedShape.coordinates,
                                castedShape.metadata,
                                castedShape.schedule ? Schedule.CreateIsoScheduleFromResponse(castedShape.schedule) : Schedule.FullUtcSchedule()
                            );
                            polygon.id = castedShape.id;
                            result.push(polygon);
                            break;
                        }
                        default:
                            break;
                    }
                });
            }
            return Object.assign({}, geofenceResponse, { result: result } as IRestResponse<Array<CircleGeofence | PolygonGeofence>>) as IRestResponse<
                Array<CircleGeofence | PolygonGeofence>
            >;
        });
    }

    async postGeofence(projectName: string, geofence: Geofence): Promise<IRestResponse<void>> {
        return RestUtilities.post(`${projectName}/geofences`, {
            ...geofence,
            schedule: Schedule.IsFullUtcSchedule(geofence.schedule) ? null : geofence.schedule.ToLocalTimeSchedule(),
        });
    }
    async putGeofence(projectName: string, id: string, geofence: Geofence): Promise<IRestResponse<void>> {
        return RestUtilities.put(`${projectName}/geofences/${id}`, {
            ...geofence,
            schedule: Schedule.IsFullUtcSchedule(geofence.schedule) ? null : geofence.schedule.ToLocalTimeSchedule(),
        });
    }
    async deleteGeofence(projectName: string, externalId: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`${projectName}/geofences/${externalId}`);
    }
}
