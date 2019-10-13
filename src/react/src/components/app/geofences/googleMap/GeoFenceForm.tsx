import * as React from 'react';
import { withStyles, createStyles, Theme, WithStyles, CssBaseline, Paper, Slide } from '@material-ui/core';
import { connect } from 'react-redux';
import { ApplicationState } from '../../../../stores/index';
import CircleGeofence from '../../../../models/app/geofences/CircleGeofence';
import PolygonGeofence from '../../../../models/app/geofences/PolygonGeofence';
import classNames = require('classnames');
import GeofenceDrawer from './drawer/GeofenceDrawer';
import GoogleMapsWrapper from './GoogleMapsWrapper';
import requireProjectSelection from '../../hocs/RequireProjectSelectionHOC';
import populateGeofencesHOC from '../../hocs/PopulateGeofencesHOC';
import populateIntegrationsHOC from '../../hocs/PopulateIntegrationsHOC';
const hash = require('object-hash');

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            height: `calc(100% - ${theme.toolbar.height}px)`,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        mapContainer: {
            height: '100%',
            width: '100%',
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.drawer.leavingDuration,
            }),
        },
        mapContainerShift: {
            [theme.breakpoints.up('sm')]: {
                width: '60%',
            },
            [theme.breakpoints.up('md')]: {
                width: '65%',
            },
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.drawer.enterDuration,
            }),
        },
        mapPaper: {
            height: '100%',
            width: '100%',
        },
    });

interface IFenceFormProps extends WithStyles<typeof styles> {
    geofenceDrawerOpen: boolean;
    geofences: Array<CircleGeofence | PolygonGeofence>;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofenceDrawerOpen: state.geofenceDrawer.isOpen, geofences: state.geofencesState.geofences };
};

type FenceFormState = {
    isMapFullyLoaded: boolean;
};

class GeofenceForm extends React.Component<IFenceFormProps, FenceFormState> {
    mapWrappedRef = React.createRef<any>();

    state = {
        isMapFullyLoaded: false,
    };

    clearMapMarkers(): any {
        throw new Error('Method not implemented.');
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <div className={classNames(classes.mapContainer, { [classes.mapContainerShift]: this.props.geofenceDrawerOpen })}>
                        <Paper elevation={0} className={classes.mapPaper}>
                            <GoogleMapsWrapper
                                innerRef={this.mapWrappedRef}
                                id={'map'}
                                options={{
                                    zoom: 12,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: false,
                                }}
                                mapFullyLoadedCallback={() => {
                                    this.setState({ isMapFullyLoaded: true });
                                }}
                            />
                        </Paper>
                    </div>
                    {this.state.isMapFullyLoaded && (
                        <GeofenceDrawer
                            clearNewCircleGeofence={this.mapWrappedRef.current.clearCircle}
                            clearNewPolygonGeofence={this.mapWrappedRef.current.clearPolygon}
                            enableMapClick={this.mapWrappedRef.current.registerMapClickHandler}
                        />
                    )}
                </main>
            </React.Fragment>
        );
    }
}

export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(requireProjectSelection(populateIntegrationsHOC(populateGeofencesHOC(GeofenceForm)))));
