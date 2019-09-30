import * as React from 'react';
import { Theme, createStyles, WithStyles, Drawer, IconButton, withStyles } from '@material-ui/core';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { FormikProps, FormikBag } from 'formik';
import CircleGeoFence from '../../../../../models/app/geofences/CircleGeoFence';
import PolygonGeoFence from '../../../../../models/app/geofences/PolygonGeoFence';
import { DialogContent, openDialog } from '../../../../../redux/actions/DialogActions';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../../stores/index';
import { ShapePicker, PolygonGeoFenceState, CircleGeoFenceState } from '../../../../../redux/actions/GoogleMapsActions';
import { closeGeoFenceDrawer } from '../../../../../redux/actions/GeoFenceDrawerActions';
import CircleGeoFenceDrawerContent from './CircleGeoFenceDrawerContent';
import PolygonGeoFenceDrawerContent from './PolygonGeoFenceDrawerContent';
import IProject from '../../../../../models/app/IProject';

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
        // drawer: {
        //     zIndex: theme.zIndex.appBar - 1,
        //     width: "100%",
        //     [theme.breakpoints.up("sm")]: {
        //         width: "40%",
        //     },
        //     [theme.breakpoints.up("md")]: {
        //         padding: theme.spacing(2),
        //         width: `calc((100% - ${theme.drawer.width}px) * .35)`,
        //     },
        //     flexShrink: 0,
        // },
        toolbar: {
            height: theme.toolbar.height,
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return {
        geofences: state.geofences,
        geoFenceDrawerOpen: state.geoFenceDrawer.isOpen,
        mapGeoFence: getMapGeoFence(state),
        editGeoFence: state.geoFenceDrawer.editGeoFence,
        selectedShape: state.googleMaps.selectedShapePicker,
        selectedProject: state.selectedProject,
        integrationNames: getIntegrationNames(state),
    };
};

const getIntegrationNames = (state: ApplicationState) => {
    return state.integrations.filter(i => i.projectName === state.selectedProject.name).map(i => i.name);
};

const getMapGeoFence = (state: ApplicationState): CircleGeoFenceState | PolygonGeoFenceState => {
    switch (state.googleMaps.selectedShapePicker) {
        case ShapePicker.Circle: {
            return state.googleMaps.CircleGeoFence;
        }
        case ShapePicker.Polygon: {
            return state.googleMaps.polygonGeoFence;
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
                    dialogContent.title,
                    dialogContent.content,
                    dialogContent.confirmText,
                    dialogContent.confirmAction,
                    dialogContent.cancelAction
                )
            );
            dispatch(action);
        },
        closeDrawer: () => {
            const action = closeGeoFenceDrawer();
            dispatch(action);
        },
    };
};

interface GeoFenceDrawerProps extends WithStyles<typeof styles>, WithSnackbarProps {
    theme: Theme;
    geofences?: Array<CircleGeoFence | PolygonGeoFence>;
    mapGeoFence: CircleGeoFenceState | PolygonGeoFenceState;
    editGeoFence: CircleGeoFence | PolygonGeoFence;
    geoFenceDrawerOpen: boolean;
    selectedShape: ShapePicker;
    selectedProject: IProject;
    integrationNames: string[];
    openDialog: (dialogCotent: DialogContent) => void;
    closeDrawer: () => void;
    clearNewCircleGeoFence: () => void;
    clearNewPolygonGeoFence: () => void;
    enableMapClick: () => void;
}

class GeoFenceDrawer extends React.Component<GeoFenceDrawerProps> {
    render() {
        const { classes, theme } = this.props;
        return (
            <Drawer
                // className={classes.drawer}
                variant="persistent"
                anchor={'right'}
                open={this.props.geoFenceDrawerOpen}
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
                    <CircleGeoFenceDrawerContent
                        selectedProject={this.props.selectedProject}
                        mapGeoFence={this.props.mapGeoFence as CircleGeoFenceState}
                        editGeoFence={this.props.editGeoFence as CircleGeoFence}
                        integrationNames={this.props.integrationNames}
                        closeDrawer={this.props.closeDrawer}
                        clearNewCircleGeoFence={this.props.clearNewCircleGeoFence}
                        enableMapClick={this.props.enableMapClick}
                    />
                ) : (
                    <PolygonGeoFenceDrawerContent
                        selectedProject={this.props.selectedProject}
                        mapGeoFence={this.props.mapGeoFence as PolygonGeoFenceState}
                        editGeoFence={this.props.editGeoFence as PolygonGeoFence}
                        integrationNames={this.props.integrationNames}
                        closeDrawer={this.props.closeDrawer}
                        clearNewPolygonGeoFence={this.props.clearNewPolygonGeoFence}
                        enableMapClick={this.props.enableMapClick}
                    />
                )}
            </Drawer>
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(withSnackbar(GeoFenceDrawer)));
