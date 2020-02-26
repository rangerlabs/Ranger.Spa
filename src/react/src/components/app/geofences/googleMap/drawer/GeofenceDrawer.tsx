import * as React from 'react';
import { Theme, createStyles, WithStyles, Drawer, withStyles } from '@material-ui/core';
import CircleGeofence from '../../../../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../../../../models/app/geofences/PolygonGeofence';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../../stores/index';
import { ShapePicker, PolygonGeofenceState, CircleGeofenceState } from '../../../../../redux/actions/GoogleMapsActions';
import { closeGeofenceDrawer } from '../../../../../redux/actions/GeofenceDrawerActions';
import CircleGeofenceDrawerContent from './CircleGeofenceDrawerContent';
import PolygonGeofenceDrawerContent from './PolygonGeofenceDrawerContent';
import IProject from '../../../../../models/app/IProject';
import { MergedIntegrationType } from '../../../../../models/app/integrations/MergedIntegrationTypes';

const styles = (theme: Theme) =>
    createStyles({
        drawerPaper: {
            zIndex: theme.zIndex.appBar - 1,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '40%',
            },
            [theme.breakpoints.up('md')]: {
                width: `calc((100% - ${theme.drawer.width}px) * .35)`,
            },
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        toolbar: {
            height: theme.toolbar.height,
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return {
        geofences: state.geofencesState.geofences,
        geofenceDrawerOpen: state.geofenceDrawer.isOpen,
        mapGeofence: getMapGeofence(state),
        editGeofence: state.geofenceDrawer.editGeofence,
        selectedShape: state.googleMaps.selectedShapePicker,
        selectedProject: state.selectedProject,
        integrations: state.integrationsState.integrations,
    };
};

const getMapGeofence = (state: ApplicationState): CircleGeofenceState | PolygonGeofenceState => {
    switch (state.googleMaps.selectedShapePicker) {
        case ShapePicker.Circle: {
            return state.googleMaps.circleGeofence;
        }
        case ShapePicker.Polygon: {
            return state.googleMaps.polygonGeofence;
        }
        default: {
            return undefined;
        }
    }
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(
                new DialogContent(
                    dialogContent.content,
                    dialogContent.title,
                    dialogContent.confirmText,
                    dialogContent.confirmAction,
                    dialogContent.cancelAction
                )
            );
            dispatch(action);
        },
        closeDrawer: () => {
            const action = closeGeofenceDrawer();
            dispatch(action);
        },
    };
};

interface GeofenceDrawerProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    geofences?: Array<CircleGeofence | PolygonGeofence>;
    mapGeofence: CircleGeofenceState | PolygonGeofenceState;
    editGeofence: CircleGeofence | PolygonGeofence;
    geofenceDrawerOpen: boolean;
    selectedShape: ShapePicker;
    selectedProject: IProject;
    integrations: MergedIntegrationType[];
    openDialog: (dialogCotent: DialogContent) => void;
    closeDrawer: () => void;
    clearNewCircleGeofence: () => void;
    clearNewPolygonGeofence: () => void;
    enableMapClick: () => void;
}

class GeofenceDrawer extends React.Component<GeofenceDrawerProps> {
    componentWillUnmount() {
        this.props.closeDrawer();
    }

    render() {
        const { classes, theme } = this.props;
        return (
            <Drawer
                // className={classes.drawer}
                variant="persistent"
                anchor={'right'}
                open={this.props.geofenceDrawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
                SlideProps={{
                    direction: 'left',
                    timeout: { enter: theme.drawer.enterDuration, exit: theme.drawer.leavingDuration },
                    mountOnEnter: true,
                    unmountOnExit: true,
                }}
            >
                <div className={classes.toolbar} />
                <div className={classes.toolbar} />
                {this.props.selectedShape === ShapePicker.Circle ? (
                    <CircleGeofenceDrawerContent
                        selectedProject={this.props.selectedProject}
                        mapGeofence={this.props.mapGeofence as CircleGeofenceState}
                        editGeofence={this.props.editGeofence as CircleGeofence}
                        integrations={this.props.integrations}
                        closeDrawer={this.props.closeDrawer}
                        clearNewCircleGeofence={this.props.clearNewCircleGeofence}
                        enableMapClick={this.props.enableMapClick}
                    />
                ) : (
                    <PolygonGeofenceDrawerContent
                        selectedProject={this.props.selectedProject}
                        mapGeofence={this.props.mapGeofence as PolygonGeofenceState}
                        editGeofence={this.props.editGeofence as PolygonGeofence}
                        integrations={this.props.integrations}
                        closeDrawer={this.props.closeDrawer}
                        clearNewPolygonGeofence={this.props.clearNewPolygonGeofence}
                        enableMapClick={this.props.enableMapClick}
                    />
                )}
            </Drawer>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withSnackbar(GeofenceDrawer)));
