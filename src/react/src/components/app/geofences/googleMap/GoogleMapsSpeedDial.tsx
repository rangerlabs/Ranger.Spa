import * as React from 'react';
import { Theme, createStyles, WithStyles, withStyles, Fab, Grow } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores/index';
import { createPortal } from 'react-dom';
import { GoogleMapsState, ShapePicker, selectShapePicker } from '../../../../redux/actions/GoogleMapsActions';
import ShapeCirclePlus from 'mdi-material-ui/ShapeCirclePlus';
import ShapePolygonPlus from 'mdi-material-ui/ShapePolygonPlus';
import VectorPolylinePlus from 'mdi-material-ui/VectorPolylinePlus';
import ContentSaveEdit from 'mdi-material-ui/ContentSaveEdit';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Close from 'mdi-material-ui/Close';

const styles = (theme: Theme) =>
    createStyles({
        speedDial: {
            bottom: theme.spacing(4),
            left: theme.spacing(4),
            position: 'absolute',
        },
        save: {
            bottom: theme.spacing(4),
        },
        speedDialActions: {
            height: 0,
        },
        clear: {
            backgroundColor: theme.palette.common.white,
            marginRight: theme.spacing(2),
            bottom: theme.spacing(4),
            color: theme.palette.error.main,
            border: `2px solid ${theme.palette.error.main}`,
            '&:hover': {
                backgroundColor: '#ffe9ea',
                border: `2px solid ${theme.palette.error.dark}`,
                color: theme.palette.error.dark,
            },
        },
        clearDisabled: {
            border: 'none',
        },
        action: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
            whiteSpace: 'pre',
        },
        // https://stackoverflow.com/questions/56169750/change-ripple-color-on-click-of-material-ui-button
        child: {
            backgroundColor: theme.palette.error.main,
        },
        rippleVisible: {
            opacity: 0.3,
        },
        '@keyframes mui-ripple-enter': {
            '0%': {
                transform: 'scale(0)',
                opacity: 0.1,
            },
            '100%': {
                transform: 'scale(1)',
                opacity: 0.3,
            },
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return {
        canCreate: !state.googleMaps.isCreatingGeofence && !state.geofenceDrawer.isOpen,
        canSave: Boolean(state.googleMaps.circleGeofence) || Boolean(state.googleMaps.polygonGeofence) || Boolean(state.googleMaps.testRun),
        isDrawerOpen: state.geofenceDrawer.isOpen,
        selectedShape: state.googleMaps.selectedShapePicker,
        enabled: isEnabled(state),
        googleMaps: state.googleMaps,
        isInfoWindowVisible: state.googleMaps.isInfoWindowVisible,
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
    clearTestRun: () => void;
    onCreate: () => void;
    canCreate: boolean;
    canSave: boolean;
    isDrawerOpen: boolean;
    isInfoWindowVisible: boolean;
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

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleCirclularClick = () => {
        if (this.props.selectedShape != ShapePicker.CIRCLE) {
            this.props.selectShapePicker(ShapePicker.CIRCLE);
        }
        this.props.mapClick();
        this.handleClose();
    };

    handlePolygonClick = () => {
        if (this.props.selectedShape != ShapePicker.POLYGON) {
            this.props.selectShapePicker(ShapePicker.POLYGON);
        }
        this.props.mapClick();
        this.handleClose();
    };

    handleTestRunClick = () => {
        if (this.props.selectedShape != ShapePicker.TESTRUN) {
            this.props.selectShapePicker(ShapePicker.TESTRUN);
        }
        this.props.mapClick();
        this.handleClose();
    };

    handleClear = () => {
        if (this.props.selectedShape == ShapePicker.CIRCLE) {
            this.props.clearCircle();
        } else if (this.props.selectedShape == ShapePicker.POLYGON) {
            this.props.clearPolygon();
        } else if (this.props.selectedShape == ShapePicker.TESTRUN) {
            this.props.clearTestRun();
        }
    };

    handleSpeedDialClick = () => {
        this.props.mapClick();
        this.handleClose();
    };

    handleExit = () => {
        this.setState({ transitioning: true });
    };
    handleExited = () => {
        this.setState({ transitioning: false });
    };
    actions = [
        { icon: <ShapeCirclePlus />, name: 'Circle', onClick: this.handleCirclularClick },
        { icon: <ShapePolygonPlus />, name: 'Polygon', onClick: this.handlePolygonClick },
        { icon: <VectorPolylinePlus />, name: 'Test Run', onClick: this.handleTestRunClick },
    ];

    render() {
        const { classes } = this.props;
        const {
            speedDial: speedDialClass,
            save: saveClass,
            speedDialActions: speedDialActionsClass,
            clear: clearClass,
            clearDisabled: clearDisabledClass,
            action: actionClass,
            ...rippleClasses
        } = classes;

        return createPortal(
            <React.Fragment>
                <Grow appear in={!this.props.canCreate && !this.state.transitioning} onExit={this.handleExit} onExited={this.handleExited}>
                    <Fab
                        disabled={this.props.isDrawerOpen}
                        TouchRippleProps={{ classes: rippleClasses }}
                        classes={{ disabled: classes.clearDisabled }}
                        className={clearClass}
                        onClick={this.handleClear}
                    >
                        <Close />
                    </Fab>
                </Grow>
                <Grow appear in={!this.props.canCreate && !this.state.transitioning}>
                    <Fab disabled={this.props.isDrawerOpen || !this.props.canSave} className={saveClass} color="primary" onClick={this.props.onCreate}>
                        <ContentSaveEdit />
                    </Fab>
                </Grow>
                <SpeedDial
                    className={speedDialClass}
                    classes={{ actions: speedDialActionsClass }}
                    ariaLabel="Geofence Control"
                    icon={<SpeedDialIcon />}
                    onOpen={this.handleOpen}
                    onClose={this.handleClose}
                    open={this.state.open}
                    FabProps={{ disabled: this.props.isInfoWindowVisible }}
                    TransitionProps={{
                        addEndListener: () => {},
                        in: this.props.canCreate && !this.state.transitioning,
                        onExit: this.handleExit,
                        onExited: this.handleExited,
                        appear: true,
                    }}
                >
                    {this.actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={action.onClick}
                            classes={{ fab: actionClass, staticTooltipLabel: actionClass }}
                        />
                    ))}
                </SpeedDial>
            </React.Fragment>,
            this.googleMapsInfoWindowOpenerContainer
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GoogleMapsSpeedDial));
