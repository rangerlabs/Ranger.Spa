const PusherResult = {
    id: '762e775c-ec6f-49a0-af73-0098e196df0b',
    project: 'Ranger Mobile App',
    environment: 'TEST',
    breadcrumb: {
        deviceId: '1',
        externalUserId: '100',
        position: {
            lat: 40.74215122953899,
            lng: -73.98790926721189,
        },
        accuracy: 10.0,
        recordedAt: '2020-07-13T22:06:41.383Z',
        acceptedAt: '2020-07-13T22:06:44.7920272Z',
        metadata: [
            {
                key: 'app-version',
                value: '1.2.0-beta',
            },
        ],
    },
    events: [
        {
            geofenceId: 'ae429e25-e505-40b0-b9ed-19b3ebeb5498',
            geofenceExternalId: 'madison-square-park',
            geofenceDescription: '',
            geofenceMetadata: [
                {
                    key: 'venue',
                    value: 'recreation',
                },
            ],
            geofenceEvent: 'ENTERED',
        },
        {
            geofenceId: 'd52ed33f-975c-479d-a283-b538800a621b',
            geofenceExternalId: 'empire-state-building',
            geofenceDescription: '',
            geofenceMetadata: [
                {
                    key: 'venue',
                    value: 'tourism',
                },
            ],
            geofenceEvent: 'EXITED',
        },
    ],
    integrationMetadata: [
        {
            key: 'department',
            value: 'marketing',
        },
    ],
} as any;
export default PusherResult;
