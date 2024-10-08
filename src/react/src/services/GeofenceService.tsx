import RestUtilities, { IRestResponse } from './RestUtilities';
import Geofence from '../models/app/geofences/Geofence';
import PolygonGeofence from '../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../models/app/geofences/CircleGeofence';
import { ShapePicker } from '../redux/actions/GoogleMapsActions';
import CoordinatePair from '../models/app/geofences/CoordinatePair';
import Schedule from '../models/Schedule';
import GeofenceBulkDelete from '../models/app/geofences/GeofenceBulkDelete';

export type OrderByOptions = 'ExternalId' | 'Shape' | 'Enabled' | 'CreatedDate' | 'UpdatedDate';
export type SortOrder = 'asc' | 'desc';

export default class GeofenceService {
    async getGeofence(projectId: string, externalId: string): Promise<IRestResponse<CircleGeofence | PolygonGeofence>> {
        return RestUtilities.get<CircleGeofence | PolygonGeofence>(`${projectId}/geofences?externalId=${externalId}`).then((geofenceResponse) => {
            if (geofenceResponse.result) {
                var geofence = this.MapGeofence(geofenceResponse.result);
            }
            return Object.assign({}, geofenceResponse, { result: geofence } as IRestResponse<CircleGeofence | PolygonGeofence>) as IRestResponse<
                CircleGeofence | PolygonGeofence
            >;
        });
    }

    async getGeofenceCountForProject(projectId: string): Promise<IRestResponse<number>> {
        return RestUtilities.get<number>(`${projectId}/geofences/count`);
    }

    async getPaginatedGeofences(
        projectId: string,
        orderBy: OrderByOptions = 'CreatedDate',
        sortOrder: SortOrder = 'desc',
        page: number = 0,
        pageCount: number = 50,
        search: string = ''
    ): Promise<IRestResponse<Array<CircleGeofence | PolygonGeofence>>> {
        return RestUtilities.get<Array<CircleGeofence | PolygonGeofence>>(
            `${projectId}/geofences?search=${search}&orderBy=${orderBy}&sortOrder=${sortOrder}&page=${page}&pageCount=${pageCount}`
        ).then((geofenceResponse) => {
            const geofences = new Array<CircleGeofence | PolygonGeofence>();
            if (geofenceResponse.result) {
                geofenceResponse.result.forEach((v) => {
                    let result = this.MapGeofence(v);
                    geofences.push(result);
                });
            }
            return Object.assign({}, geofenceResponse, { result: geofences } as IRestResponse<Array<CircleGeofence | PolygonGeofence>>) as IRestResponse<
                Array<CircleGeofence | PolygonGeofence>
            >;
        });
    }

    async getBoundedGeofences(projectId: string, bounds: CoordinatePair[]): Promise<IRestResponse<Array<CircleGeofence | PolygonGeofence>>> {
        const jsonBounds = bounds.map((b) => JSON.stringify(b)).join(';');
        return RestUtilities.get<Array<CircleGeofence | PolygonGeofence>>(`${projectId}/geofences?bounds=${jsonBounds}`).then((geofenceResponse) => {
            const geofences = new Array<CircleGeofence | PolygonGeofence>();
            if (geofenceResponse.result) {
                geofenceResponse.result.forEach((v) => {
                    let result = this.MapGeofence(v);
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

    async bulkDeleteGeofences(projectId: string, geofenceBulkDeleteModel: GeofenceBulkDelete): Promise<IRestResponse<void>> {
        return RestUtilities.post(`${projectId}/geofences/bulk-delete`, geofenceBulkDeleteModel);
    }

    private MapGeofence(v: CircleGeofence | PolygonGeofence) {
        switch (v.shape) {
            case ShapePicker.CIRCLE: {
                const castedShape = v as CircleGeofence;
                const result = new CircleGeofence(
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
                    castedShape.schedule ? Schedule.CreateIsoScheduleFromResponse(castedShape.schedule) : Schedule.FullUtcSchedule(),
                    new Date(castedShape.createdDate),
                    new Date(castedShape.updatedDate)
                );
                result.id = castedShape.id;
                return result;
            }
            case ShapePicker.POLYGON: {
                const castedShape = v as PolygonGeofence;
                const result = new PolygonGeofence(
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
                    castedShape.schedule ? Schedule.CreateIsoScheduleFromResponse(castedShape.schedule) : Schedule.FullUtcSchedule(),
                    new Date(castedShape.createdDate),
                    new Date(castedShape.updatedDate)
                );
                result.id = castedShape.id;
                return result;
            }
            default:
                break;
        }
    }
}
