import * as React from 'react';
import { Theme, createStyles, WithStyles, Drawer, withStyles, Typography } from '@material-ui/core';
import CircleGeofence from '../../../../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../../../../models/app/geofences/PolygonGeofence';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../../stores/index';
import { ShapePicker, PolygonGeofenceState, CircleGeofenceState, setCreatingGeofence, TestRunState } from '../../../../../redux/actions/GoogleMapsActions';
import { closeGeofenceDrawer } from '../../../../../redux/actions/GeofenceDrawerActions';
import CircleGeofenceDrawerContent from './CircleGeofenceDrawerContent';
import PolygonGeofenceDrawerContent from './PolygonGeofenceDrawerContent';
import IProject from '../../../../../models/app/IProject';
import { MergedIntegrationType } from '../../../../../models/app/integrations/MergedIntegrationTypes';
import AddTimeFormatValidatorToYup from '../../../../../yup/AddTimeGreaterThanValidatorToYup';
import TestRun from '../../../../../models/app/geofences/TestRun';
import TestRunDrawerContent from './TestRunDrawerContent';

const styles = (theme: Theme) =>
    createStyles({
        drawerPaper: {
            zIndex: theme.zIndex.appBar - 1,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '40%',
            },
            [theme.breakpoints.up('md')]: {
                width: `calc((100% - ${theme.drawer.width}px) * .4)`,
            },
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return {
        geofences: state.geofencesState.mapGeofences
            .concat(state.geofencesState.pendingCreation)
            .concat(state.geofencesState.pendingUpdate.map((g) => g.updated)),
        geofenceDrawerOpen: state.geofenceDrawer.isOpen,
        mapObject: getMapObject(state),
        editGeofence: state.geofenceDrawer.editGeofence,
        selectedShape: state.googleMaps.selectedShapePicker,
        selectedProject: state.selectedProject,
        integrations: state.integrationsState.integrations,
    };
};

const getMapObject = (state: ApplicationState): CircleGeofenceState | PolygonGeofenceState | TestRun => {
    switch (state.googleMaps.selectedShapePicker) {
        case ShapePicker.CIRCLE: {
            return state.googleMaps.circleGeofence;
        }
        case ShapePicker.POLYGON: {
            return state.googleMaps.polygonGeofence;
        }
        case ShapePicker.TESTRUN: {
            return state.googleMaps.testRun;
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
        cancelCreatingGeofence: () => {
            const action = setCreatingGeofence(false);
            dispatch(action);
        },
    };
};

interface GeofenceDrawerProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    geofences?: Array<CircleGeofence | PolygonGeofence>;
    mapObject: CircleGeofenceState | PolygonGeofenceState | TestRun;
    editGeofence: CircleGeofence | PolygonGeofence;
    geofenceDrawerOpen: boolean;
    selectedShape: ShapePicker;
    selectedProject: IProject;
    integrations: MergedIntegrationType[];
    openDialog: (dialogCotent: DialogContent) => void;
    closeDrawer: () => void;
    cancelCreatingGeofence: () => void;
    clearNewCircleGeofence: () => void;
    clearNewPolygonGeofence: () => void;
    clearNewTestRun: () => void;
}

class GeofenceDrawer extends React.Component<GeofenceDrawerProps> {
    constructor(props: GeofenceDrawerProps) {
        super(props);
        AddTimeFormatValidatorToYup();
    }

    closeDrawer = () => {
        this.props.closeDrawer();
        this.props.cancelCreatingGeofence();
    };

    getContent = () => {
        switch (this.props.selectedShape) {
            case ShapePicker.CIRCLE: {
                return (
                    <CircleGeofenceDrawerContent
                        selectedProject={this.props.selectedProject}
                        mapGeofence={this.props.mapObject as CircleGeofenceState}
                        editGeofence={this.props.editGeofence as CircleGeofence}
                        integrations={this.props.integrations}
                        closeDrawer={this.closeDrawer}
                        clearNewCircleGeofence={this.props.clearNewCircleGeofence}
                    />
                );
            }
            case ShapePicker.POLYGON: {
                return (
                    <PolygonGeofenceDrawerContent
                        selectedProject={this.props.selectedProject}
                        mapGeofence={this.props.mapObject as PolygonGeofenceState}
                        editGeofence={this.props.editGeofence as PolygonGeofence}
                        integrations={this.props.integrations}
                        closeDrawer={this.closeDrawer}
                        clearNewPolygonGeofence={this.props.clearNewPolygonGeofence}
                    />
                );
            }
            case ShapePicker.TESTRUN: {
                return (
                    <TestRunDrawerContent
                        selectedProject={this.props.selectedProject}
                        testRun={this.props.mapObject as TestRunState}
                        closeDrawer={this.closeDrawer}
                        clearNewTestRun={this.props.clearNewTestRun}
                    />
                );
            }
        }
    };

    render() {
        const { classes, theme } = this.props;
        return (
            <Drawer
                variant="persistent"
                anchor={'right'}
                open={this.props.geofenceDrawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
                elevation={2}
                SlideProps={{
                    direction: 'left',
                    timeout: { enter: theme.drawer.enterDuration, exit: theme.drawer.leavingDuration },
                    mountOnEnter: true,
                    unmountOnExit: true,
                }}
            >
                {this.getContent()}
            </Drawer>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(withSnackbar(GeofenceDrawer)));
