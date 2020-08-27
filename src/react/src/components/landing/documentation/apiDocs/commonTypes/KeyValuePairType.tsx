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
import KeyValuePair from '../../../../../models/KeyValuePair';
import { func } from 'prop-types';
import { scrollToLandingId } from '../../../../../helpers/Helpers';

const keyValuePair = [
    <EndpointBodyListItem name="key" type="string" required description="Metadata key" />,
    <EndpointBodyListItem name="value" type="string" required description="Metadata value" />,
];

const properties = [
    {
        title: 'Key-Value Pair',
        description: <UnorderedList items={keyValuePair} />,
    },
] as EndpointProperty[];

const PostGeofencesApi = function () {
    return (
        <React.Fragment>
            <EndpointHeaderBlock>
                <Typography>Used to define a key-value pair for headers and metadata.</Typography>
            </EndpointHeaderBlock>
            <EndpointPropertiesList properties={properties} />
        </React.Fragment>
    );
};

interface KeyValuePairEndpointBodyListItemProps {
    name: string;
    description: string;
}

export const KeyValuePairEndpointBodyListItem = function (props: KeyValuePairEndpointBodyListItemProps) {
    return (
        <EndpointBodyListItem
            name={props.name}
            type={
                <Link variant="caption" component="button" onClick={() => scrollToLandingId('key-value-pair-section')}>
                    Key-Value Pair
                </Link>
            }
            description={props.description}
        />
    );
};

export default PostGeofencesApi;
