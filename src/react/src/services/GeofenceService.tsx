import RestUtilities, { IRestResponse } from './RestUtilities';
import Geofence from '../models/app/geofences/Geofence';
import PolygonGeofence from '../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../models/app/geofences/CircleGeofence';
import { ShapePicker } from '../redux/actions/GoogleMapsActions';
import CoordinatePair from '../models/app/geofences/CoordinatePair';
import Schedule from '../models/Schedule';

export type OrderByOptions = 'ExternalId' | 'Shape' | 'Enabled' | 'CreatedDate' | 'UpdatedDate';
export type SortOrder = 'asc' | 'desc';

export default class GeofenceService {
    async getPaginatedGeofences(
        projectId: string,
        orderBy: OrderByOptions = 'CreatedDate',
        sortOrder: SortOrder = 'desc',
        page: number = 0,
        pageCount: number = 100
    ): Promise<IRestResponse<Array<CircleGeofence | PolygonGeofence>>> {
        return RestUtilities.get<Array<CircleGeofence | PolygonGeofence>>(
            `${projectId}/geofences?orderBy=${orderBy}&sortOrder=${sortOrder}&page=${page}&pageCount=${pageCount}`
        ).then((geofenceResponse) => {
            const geofences = new Array<CircleGeofence | PolygonGeofence>();
            if (geofenceResponse.result) {
                geofenceResponse.result.forEach((v) => {
                    let result = undefined;
                    result = this.MapGeofence(v, result);
                    geofences.push(result);
                });
            }
            return Object.assign({}, geofenceResponse, { result: geofences } as IRestResponse<Array<CircleGeofence | PolygonGeofence>>) as IRestResponse<
                Array<CircleGeofence | PolygonGeofence>
            >;
        });
    }

    async getBoundedGeofences(
        projectId: string,
        bounds: CoordinatePair[],
        orderBy: OrderByOptions = 'CreatedDate',
        sortOrder: SortOrder = 'desc'
    ): Promise<IRestResponse<Array<CircleGeofence | PolygonGeofence>>> {
        return RestUtilities.get<Array<CircleGeofence | PolygonGeofence>>(
            `${projectId}/geofences?orderBy=${orderBy}&sortOrder=${sortOrder}&bounds=${bounds}`
        ).then((geofenceResponse) => {
            const geofences = new Array<CircleGeofence | PolygonGeofence>();
            if (geofenceResponse.result) {
                geofenceResponse.result.forEach((v) => {
                    let result = undefined;
                    result = this.MapGeofence(v, result);
                    geofences.push(result);
                });
            }
            return Object.assign({}, geofenceResponse, { result: geofences } as IRestResponse<Array<CircleGeofence | PolygonGeofence>>) as IRestResponse<
                Array<CircleGeofence | PolygonGeofence>
            >;
        });
    }

    async postGeofence(projectId: string, geofence: Geofence): Promise<IRestResponse<void>> {
        return RestUtilities.post(`${projectId}/geofences`, {
            ...geofence,
            schedule: Schedule.IsFullUtcSchedule(geofence.schedule) ? null : geofence.schedule.ToLocalTimeSchedule(),
        });
    }
    async putGeofence(projectId: string, id: string, geofence: Geofence): Promise<IRestResponse<void>> {
        return RestUtilities.put(`${projectId}/geofences/${id}`, {
            ...geofence,
            schedule: Schedule.IsFullUtcSchedule(geofence.schedule) ? null : geofence.schedule.ToLocalTimeSchedule(),
        });
    }
    async deleteGeofence(projectId: string, externalId: string): Promise<IRestResponse<void>> {
        return RestUtilities.delete(`${projectId}/geofences/${externalId}`);
    }

    private MapGeofence(v: CircleGeofence | PolygonGeofence, result: any) {
        switch (v.shape) {
            case ShapePicker.CIRCLE: {
                const castedShape = v as CircleGeofence;
                result = new CircleGeofence(
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
                result.id = castedShape.id;
                break;
            }
            case ShapePicker.POLYGON: {
                const castedShape = v as PolygonGeofence;
                result = new PolygonGeofence(
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
                result.id = castedShape.id;
                break;
            }
            default:
                break;
        }
        return result;
    }
}
