import React from 'react';
import { Typography, Link } from '@material-ui/core';
import HttpMethod from '../../textEnhancers/HttpMethod';
import EndpointHeaderBlock from '../../docComponents/EndpointHeaderBlock';
import EndpointPropertiesList, { EndpointProperty } from '../../docComponents/EndpointPropertyList';
import { EndpointBodyListItem } from '../../docComponents/EndpointBodyList';
import { UnorderedList } from '../../docComponents/UnorderedList';
import SampleRequest from '../../docComponents/SampleRequest';
import JsonViewer from '../../docComponents/JsonViewer';
import PostGeofence from '../../json/geofences/PostGeofence';
import { scrollToLandingId } from '../../../../../helpers/Helpers';

const dailySchedule = [
    <EndpointBodyListItem name="startTime" type="string" required description="The time when this geofence may begin executing integrations - HH:mm:ss" />,
    <EndpointBodyListItem name="endTime" type="string" required description="The time when this geofence must stop executing integrations - HH:mm:ss" />,
];

const schedule = [
    <EndpointBodyListItem
        name="timeZoneId"
        type="string"
        required
        description="IANA Time Zone Name that the Breadcrumb.RecordedAt property should be converted to and evaluated against"
    />,
    <EndpointBodyListItem name="sunday" type="object" required description="The Sunday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="monday" type="object" required description="The Monday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="tuesday" type="object" required description="The Tuesday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="wednesday" type="object" required description="The Wednesday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="thursday" type="object" required description="The Thursday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="friday" type="object" required description="The Friday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
    <EndpointBodyListItem name="saturday" type="object" required description="The Saturday daily schedule" item={<UnorderedList items={dailySchedule} />} />,
];

const properties = [
    {
        description: <UnorderedList items={schedule} />,
    },
] as EndpointProperty[];

const ScheduleType = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Used to define a weekly geofence schedule.</Typography>
            </EndpointHeaderBlock>
            <EndpointPropertiesList properties={properties} />
        </React.Fragment>
    );
};

export const ScheduleEndpointBodyListItem = function () {
    return (
        <EndpointBodyListItem
            name="schedule"
            type={
                <Link variant="caption" component="button" onClick={() => scrollToLandingId('schedule-section')}>
                    Schedule
                </Link>
            }
            description="The weekly schedule for when this geofence may execute integrations, exclude the execute integrations at all times"
        />
    );
};

export default ScheduleType;
