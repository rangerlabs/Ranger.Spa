import * as React from 'react';
import { Theme, createStyles, WithStyles, Button, withStyles, Fab, Grow } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores/index';
import { createPortal } from 'react-dom';
import { GoogleMapsState, ShapePicker, selectShapePicker } from '../../../../redux/actions/GoogleMapsActions';
import ShapeCirclePlus from 'mdi-material-ui/ShapeCirclePlus';
import ShapePolygonPlus from 'mdi-material-ui/ShapePolygonPlus';
import SpeedDial from '@material-ui/lab/SpeedDial';
import Plus from 'mdi-material-ui/Plus';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { GeofenceDrawerState } from '../../../../redux/actions/GeofenceDrawerActions';
import Delete from 'mdi-material-ui/Delete';

const styles = (theme: Theme) =>
    createStyles({
        speedDial: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
        clear: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.common.white,
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
            },
        },
        hoverPrimaryColor: {
            '&:hover': {
                backgroundColor: theme.palette.primary,
            },
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return {
        canClear: Boolean(state.googleMaps.circleGeofence || state.googleMaps.polygonGeofence) && !state.geofenceDrawer.isOpen,
        selectedShape: state.googleMaps.selectedShapePicker,
        enabled: isEnabled(state),
        googleMaps: state.googleMaps,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        selectShapePicker: (shape: ShapePicker) => {
            const selectShapePickerAction = selectShapePicker(shape);
            dispatch(selectShapePickerAction);
        },
    };
};

const isEnabled = (state: ApplicationState) => {
    return (state.googleMaps.circleGeofence || state.googleMaps.polygonGeofence) && !state.googleMaps.isInfoWindowVisible && !state.geofenceDrawer.isOpen;
};

interface GoogleMapsSpeedDialProps extends WithStyles<typeof styles> {
    selectShapePicker: (shape: ShapePicker) => void;
    selectedShape: ShapePicker;
    map: google.maps.Map;
    enabled: boolean;
    googleMaps: GoogleMapsState;
    mapClick: () => void;
    clearCircle: () => void;
    clearPolygon: () => void;
    canClear: boolean;
}

interface GoogleMapsSpeedDialState {
    open: boolean;
    transitioning: boolean;
}

class GoogleMapsSpeedDial extends React.Component<GoogleMapsSpeedDialProps, GoogleMapsSpeedDialState> {
    constructor(props: GoogleMapsSpeedDialProps) {
        super(props);
        this.googleMapsInfoWindowOpenerContainer = document.createElement('div');
        this.props.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.googleMapsInfoWindowOpenerContainer);
    }
    googleMapsInfoWindowOpenerContainer: HTMLDivElement = undefined;

    state: GoogleMapsSpeedDialState = {
        open: false,
        transitioning: false,
    };

    toggleTransitioning = () => {
        this.setState((prevState) => ({
            transitioning: !prevState.transitioning,
        }));
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleCirclularClick = () => {
        if (this.props.selectedShape != ShapePicker.Circle) {
            this.props.selectShapePicker(ShapePicker.Circle);
        }
        this.props.mapClick();
        this.handleClose();
    };

    handlePolygonClick = () => {
        if (this.props.selectedShape != ShapePicker.Polygon) {
            this.props.selectShapePicker(ShapePicker.Polygon);
        }
        this.props.mapClick();
        this.handleClose();
    };

    handleClear = () => {
        if (this.props.selectedShape == ShapePicker.Circle) {
            this.props.clearCircle();
        } else if (this.props.selectedShape == ShapePicker.Polygon) {
            this.props.clearPolygon();
        }
    };

    actions = [
        { icon: <ShapeCirclePlus />, name: 'Circle', onClick: this.handleCirclularClick },
        { icon: <ShapePolygonPlus />, name: 'Polygon', onClick: this.handlePolygonClick },
    ];

    render() {
        const { classes } = this.props;
        return createPortal(
            <React.Fragment>
                <Grow
                    in={this.props.canClear && !this.state.transitioning}
                    onExit={() => this.toggleTransitioning()}
                    onExited={() => this.toggleTransitioning()}
                >
                    <Fab className={classes.clear} onClick={this.handleClear}>
                        <Delete />
                    </Fab>
                </Grow>
                <Grow
                    appear
                    in={!this.props.canClear && !this.state.transitioning}
                    onExit={() => this.toggleTransitioning()}
                    onExited={() => this.toggleTransitioning()}
                >
                    <SpeedDial
                        ariaLabel="Geofence Control"
                        className={classes.speedDial}
                        icon={<Plus />}
                        onOpen={this.handleOpen}
                        onClose={this.handleClose}
                        open={this.state.open}
                    >
                        {this.actions.map((action) => (
                            <SpeedDialAction
                                className={classes.hoverPrimaryColor}
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                tooltipOpen
                                onClick={action.onClick}
                            />
                        ))}
                    </SpeedDial>
                </Grow>
            </React.Fragment>,
            this.googleMapsInfoWindowOpenerContainer
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GoogleMapsSpeedDial));
