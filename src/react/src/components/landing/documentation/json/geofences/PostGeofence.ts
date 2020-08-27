const PostGeofence = {
    shape: 'Circle',
    externalId: 'geofence',
    description: '',
    onEnter: true,
    onDwell: false,
    onExit: true,
    enabled: true,
    integrationIds: ['8384169e-cd87-432d-b587-5703bc9df7e7'],
    coordinates: [{ lng: -81.69363476923826, lat: 41.50104519337268 }],
    metadata: [{ key: 'venue', value: 'city' }],
    radius: 1389,
    schedule: {
        timeZoneId: 'US/Eastern',
        sunday: { startTime: '09:00:00', endTime: '17:59:59' },
        monday: { startTime: '09:00:00', endTime: '17:59:59' },
        tuesday: { startTime: '09:00:00', endTime: '17:59:59' },
        wednesday: { startTime: '09:00:00', endTime: '17:59:59' },
        thursday: { startTime: '09:00:00', endTime: '17:59:59' },
        friday: { startTime: '09:00:00', endTime: '17:59:59' },
        saturday: { startTime: '09:00:00', endTime: '17:59:59' },
    },
} as any;

export default PostGeofence;
