const UnsuccessfulResponseBody = {
    statusCode: 400,
    isError: true,
    error: {
        message: 'Request responded with one or more validation errors.',
        validationErrors: [
            {
                name: 'Radius',
                reason: 'Radius must be greater than or equal to 50 meters for Circular geofences',
            },
            {
                name: 'ExternalId',
                reason: "The length of 'External Id' must be at least 3 characters. You entered 2 characters.",
            },
            {
                name: 'ExternalId',
                reason: 'Must begin, end, and contain lowercase alphanumeric characters. May contain ( - ).',
            },
        ],
    },
} as any;

export default UnsuccessfulResponseBody;
