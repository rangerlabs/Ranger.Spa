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

const lngLat = [
    <EndpointBodyListItem name="lng" type="number" required description="Coordinate longitude, [-180, 180]" />,
    <EndpointBodyListItem name="lat" type="number" required description="Coordinate latitude, [-90, 90]" />,
];

const properties = [
    {
        title: 'LngLat',
        description: <UnorderedList items={lngLat} />,
    },
] as EndpointProperty[];

interface LngLatEndpointBodyListItemProps {
    name: string;
    description: string;
}

export const LngLatEndpointBodyListItem = function (props: LngLatEndpointBodyListItemProps) {
    return (
        <EndpointBodyListItem
            name="coordinates"
            type={
                <Link variant="caption" component="button" onClick={() => scrollToLandingId('lnglat-section')}>
                    LngLat
                </Link>
            }
            required
            description={props.description}
        />
    );
};

const PostGeofencesApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Used to define a position or coordinate pair.</Typography>
            </EndpointHeaderBlock>
            <EndpointPropertiesList properties={properties} />
        </React.Fragment>
    );
};

export default PostGeofencesApi;
