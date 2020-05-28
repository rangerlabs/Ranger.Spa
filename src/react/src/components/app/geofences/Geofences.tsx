import * as React from 'react';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addGeofence, GeofencesState } from '../../../redux/actions/GeofenceActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import populateGeofencesHOC from '../hocs/PopulateGeofencesHOC';
import populateIntegrationsHOC from '../hocs/PopulateIntegrationsHOC';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import IProject from '../../../models/app/IProject';
import RoutePaths from '../../RoutePaths';
import { Grid, Theme, createStyles, withStyles, WithStyles, TableFooter } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
const MUIDataTable = require('mui-datatables').default;

const styles = (theme: Theme) =>
    createStyles({
        grid: {
            padding: theme.spacing(2),
        },
        footer: {
            display: 'block',
            height: '54px',
        },
    });

interface GeofencesProps extends WithStyles<typeof styles> {
    geofencesState: GeofencesState;
    addGeofence: (geofence: CircleGeofence | PolygonGeofence) => void;
    push: typeof push;
    selectedProject: IProject;
}

const mapStateToProps = (state: ApplicationState) => {
    return { geofences: selectedProjectGeofences(state.geofencesState.geofences, state.selectedProject.name), selectedProject: state.selectedProject };
};

const selectedProjectGeofences = (geofences: Array<CircleGeofence | PolygonGeofence>, name: string) => {
    return geofences.filter((f) => f.projectId === name);
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addGeofence: (geofence: CircleGeofence | PolygonGeofence) => {
            const action = addGeofence(geofence);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class Geofences extends React.Component<GeofencesProps> {
    refs: {
        query: HTMLInputElement;
    };

    editGeofence = (rowData: string[]) => {
        this.props.push(`${RoutePaths.GeofencesEdit.replace(':appName', this.props.selectedProject.name)}?name=${rowData[1]}`);
    };

    redirectToNewGeofenceForm = () => {
        this.props.push(`${RoutePaths.GeofenceMap.replace(':appName', this.props.selectedProject.name)}`);
    };

    mapGeofencesToTableGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): Array<Array<any>> {
        const tableGeofences = new Array<Array<any>>();
        if (geofences) {
            geofences.forEach((value) => {
                tableGeofences.push([
                    value.enabled,
                    value.externalId,
                    value.description,
                    value.shape == ShapePicker.Circle ? 'Circle' : 'Polygon',
                    value.onEnter,
                    value.onExit,
                ]);
            });
        }
        return tableGeofences;
    }

    booleanRender = (value: boolean): JSX.Element => {
        return value ? <CheckCircleOutlineIcon color="primary" /> : <HighlightOffIcon color="error" />;
    };
    columns = [
        {
            name: 'Enabled',
            options: {
                filter: true,
            },
            customBodyRender: (value: boolean) => {
                return this.booleanRender(value);
            },
        },
        {
            name: 'Name',
            options: {
                filter: false,
            },
        },
        {
            name: 'Description',
            options: {
                filter: false,
            },
        },
        {
            name: 'Shape',
            options: {
                filter: true,
            },
        },
        {
            name: 'On Enter',
            options: {
                filter: true,
            },
            customBodyRender: (value: boolean) => {
                return this.booleanRender(value);
            },
        },
        {
            name: 'On Exit',
            options: {
                filter: true,
            },
            customBodyRender: (value: boolean) => {
                return this.booleanRender(value);
            },
        },
    ];
    options = {
        textLabels: {
            body: {
                noMatch: 'Your organization has not created any geofences yet.',
            },
        },
        print: false,
        download: false,
        customToolbar: () => {
            return <CustomAddToolbar toggleFormFlag={this.redirectToNewGeofenceForm} />;
        },
        customFooter: this.props.geofencesState.geofences?.length > 10 ? null : () => <TableFooter className={this.props.classes.footer} />,
        elevation: 3,
        selectableRows: 'none',
        responsive: 'stacked',
        viewColumns: false,
        onRowClick: this.editGeofence,
    };

    render() {
        const { classes, geofencesState } = this.props;
        return (
            <Grid className={classes.grid} container justify="center" alignItems="center">
                <Grid item xs={12}>
                    <MUIDataTable
                        title={'Geofences'}
                        data={this.mapGeofencesToTableGeofences(geofencesState.geofences)}
                        columns={this.columns}
                        options={this.options}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateIntegrationsHOC(populateGeofencesHOC(Geofences))));
