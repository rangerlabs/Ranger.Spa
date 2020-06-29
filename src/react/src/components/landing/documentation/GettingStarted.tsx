import React from 'react';
import { Typography } from '@material-ui/core';
import CentralPark from '../../../../assets/central-park.png';
import Breadcrumbs from '../../../../assets/breadcrumbs.png';

export default function GettingStarted() {
    return (
        <React.Fragment>
            <Typography variant="h4">Getting Started with Ranger</Typography>
            <Typography variant="body1">
                Welcome to Ranger. At Ranger, we provide hosted APIs for boundless geofencing services. Our growing list of location-centric APIs and
                Integrations will enable you and your organization to easily implement cloud-native location services into your mobile apps.
            </Typography>
            <Typography variant="h4">Unrivaled Geofencing</Typography>
            <Typography variant="body1">
                Geofences are virtual boundaries around physical locations - and Ranger's geofencing solution provides unrivaled functionality.
            </Typography>
            <Typography variant="body1">
                Ranger's easy-to-use interface for creating geofences allows you to quickly visualize where geofences are in relation to one another and whether
                they overlap with existing geofences.
            </Typography>
            <div style={{ textAlign: 'center' }}>
                <img style={{ maxWidth: '70%' }} src={CentralPark} alt="central-park-geofence" />
            </div>
            <Typography variant="body1">
                Furthermore, the Ranger platform enables you to customize what events get triggered and where those events go - all on a per geofence basis.
            </Typography>
            <Typography variant="body1">
                Do you want to collect Analytics for all geofences but send Marketing material for only a subset of your geofences? Ranger has all that handled
                and more.
            </Typography>
            <Typography variant="body1">
                To learn more about Ranger's extensively customizable geofences, take a look at our section dedicated to Geofencing.
            </Typography>
            <Typography variant="h4">Breadcrumbs</Typography>
            <Typography variant="body1">
                Breadcrumbs are the foundation of Ranger. The Ranger API ingests Breadcrumbs from devices running your mobile app and uses the trail of
                Breadcrumbs to compute whether the device or user has Entered, is Dwelling, or has Exited any combination geofences.
            </Typography>
            <div style={{ textAlign: 'center' }}>
                <img style={{ maxWidth: '70%' }} src={Breadcrumbs} alt="breadcrumbs" />
            </div>
            <Typography variant="body1">
                To learn more about how to start sending Breadcrumbs to Ranger, check-out our section all about Breadcrumbs.
            </Typography>
        </React.Fragment>
    );
}
