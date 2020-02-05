import * as React from 'react';
import { Theme, createStyles, WithStyles, Button, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores/index';
import { createPortal } from 'react-dom';
import TooltipOutline from 'mdi-material-ui/TooltipOutline';
import { GoogleMapsState, ShapePicker } from '../../../../redux/actions/GoogleMapsActions';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#fff',
            border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(0,0,0,.3)',
            cursor: 'pointer',
            marginBottom: '22px',
            marginTop: '10px',
            textAlign: 'center',
        },
        font: {
            fontFamily: "'Lato', sans-serif",
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return { enabled: isEnabled(state), googleMaps: state.googleMaps };
};

const isEnabled = (state: ApplicationState) => {
    return (state.googleMaps.circleGeofence || state.googleMaps.polygonGeofence) && !state.googleMaps.isInfoWindowVisible && !state.geofenceDrawer.isOpen;
};

interface GoogleMapsInfoWindowOpenerProps extends WithStyles<typeof styles> {
    map: google.maps.Map;
    enabled: boolean;
    googleMaps: GoogleMapsState;
    onClick: () => void;
}

class GoogleMapsInfoWindowOpener extends React.Component<GoogleMapsInfoWindowOpenerProps> {
    constructor(props: GoogleMapsInfoWindowOpenerProps) {
        super(props);
        this.googleMapsInfoWindowOpenerContainer = document.createElement('div');
        this.props.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.googleMapsInfoWindowOpenerContainer);
    }
    googleMapsInfoWindowOpenerContainer: HTMLDivElement = undefined;

    render() {
        const { classes } = this.props;
        return createPortal(
            <div className={classes.root}>
                <Button
                    startIcon={<TooltipOutline />}
                    className={classes.font}
                    disabled={!this.props.enabled}
                    variant={'contained'}
                    color="primary"
                    onClick={this.props.onClick}
                >
                    Options
                </Button>
            </div>,
            this.googleMapsInfoWindowOpenerContainer
        );
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(GoogleMapsInfoWindowOpener));
