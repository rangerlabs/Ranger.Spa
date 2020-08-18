const SuccessfulResponseBody = {
    statusCode: 200,
    message: 'Successfully retrieved geofences',
    isError: false,
    result: [
        {
            shape: 'Circle',
            coordinates: [
                {
                    lat: 41.49976866019599,
                    lng: -81.6928871883789,
                },
            ],
            radius: 2456,
            id: '56bff529-62a0-46bd-bc20-28f38d5599c7',
            externalId: 'ranger-hq',
            projectId: 'acc7a626-8898-42db-91a6-4ada325c9d10',
            description: '',
            integrationIds: ['84d3eb1a-b991-4749-a1ed-e767ce37f253'],
            metadata: [],
            onEnter: true,
            onDwell: false,
            onExit: true,
            enabled: true,
            schedule: null,
        },
    ],
} as any;

export default SuccessfulResponseBody;
