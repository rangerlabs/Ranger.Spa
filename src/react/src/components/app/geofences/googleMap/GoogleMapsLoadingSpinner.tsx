import * as React from 'react';
import { CircularProgress } from '@material-ui/core';
import { createPortal } from 'react-dom';

interface GoogleMapsLoadingSpinnerProps {
    enabled: boolean;
    map: google.maps.Map;
}

class GoogleMapsLoadingSpinner extends React.Component<GoogleMapsLoadingSpinnerProps> {
    constructor(props: GoogleMapsLoadingSpinnerProps) {
        super(props);
        this.googleMapsInfoWindowOpenerContainer = document.createElement('div');
        this.props.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.googleMapsInfoWindowOpenerContainer);
    }
    googleMapsInfoWindowOpenerContainer: HTMLDivElement = undefined;

    render() {
        return this.props.enabled && createPortal(<CircularProgress size={48} />, this.googleMapsInfoWindowOpenerContainer);
    }
}

export default GoogleMapsLoadingSpinner;
