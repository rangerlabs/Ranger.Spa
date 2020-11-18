import * as React from 'react';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import {
    GeofencesState,
    populateTableGeofences,
    setPage,
    setPageCount,
    setOrderBy,
    setSortOrder,
    setIsTableLoaded,
    resetTableGeofences,
} from '../../../redux/actions/GeofenceActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import PolygonGeofence from '../../../models/app/geofences/PolygonGeofence';
import CircleGeofence from '../../../models/app/geofences/CircleGeofence';
import populateTableGeofencesHOC from '../hocs/PopulateTableGeofencesHOC';
import populateIntegrationsHOC from '../hocs/PopulateIntegrationsHOC';
import { ShapePicker } from '../../../redux/actions/GoogleMapsActions';
import IProject from '../../../models/app/IProject';
import RoutePaths from '../../RoutePaths';
import { Grid, Theme, createStyles, withStyles, WithStyles, CircularProgress, Typography } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import GeofenceService, { OrderByOptions, SortOrder } from '../../../services/GeofenceService';
const MUIDataTable = require('mui-datatables').default;
const debounceSearchRender = require('mui-datatables').debounceSearchRender;

const styles = (theme: Theme) =>
    createStyles({
        grid: {
            padding: theme.spacing(2),
        },
        footer: {
            display: 'block',
            height: '54px',
        },
        tableIcon: {
            paddingRight: theme.spacing(1),
            verticalAlign: 'middle',
        },
    });

const geofencesService = new GeofenceService();

type MuiDatatablesSortType = {
    name: OrderByOptions;
    direction: SortOrder;
};

interface GeofencesProps extends WithStyles<typeof styles> {
    geofencesState: GeofencesState;
    push: typeof push;
    selectedProject: IProject;
    sortOrder: SortOrder;
    orderBy: OrderByOptions;
    page: number;
    pageCount: number;
    setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>) => void;
    setPage: (page: number) => void;
    setPageCount: (pageCount: number) => void;
    setOrderBy: (orderBy: OrderByOptions) => void;
    setSortOrder: (sortOrder: SortOrder) => void;
    resetTableGeofences: () => void;
}

interface LocalGeofencesState {
    wasError: boolean;
    count: number;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        geofencesState: state.geofencesState,
        selectedProject: state.selectedProject,
        sortOrder: state.geofencesState.sortOrder,
        orderBy: state.geofencesState.orderBy,
        page: state.geofencesState.page,
        pageCount: state.geofencesState.pageCount,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>) => {
            const action = populateTableGeofences(geofences);
            dispatch(action);
        },
        setPage: (page: number) => {
            const action = setPage(page);
            dispatch(action);
        },
        setPageCount: (pageCount: number) => {
            const action = setPageCount(pageCount);
            dispatch(action);
        },
        setOrderBy: (orderBy: OrderByOptions) => {
            const action = setOrderBy(orderBy);
            dispatch(action);
        },
        setSortOrder: (sortOrder: SortOrder) => {
            const action = setSortOrder(sortOrder);
            dispatch(action);
        },
        resetTableGeofences: () => {
            const action = resetTableGeofences();
            dispatch(action);
        },
    };
};

class Geofences extends React.Component<GeofencesProps, LocalGeofencesState> {
    state: LocalGeofencesState = {
        wasError: false,
        count: 0,
    };

    refs: {
        query: HTMLInputElement;
    };

    componentWillUnmount() {
        this.props.resetTableGeofences();
    }

    editGeofence = (rowData: string[]) => {
        this.props.push(`${RoutePaths.GeofencesEdit.replace(':appName', this.props.selectedProject.name)}?name=${rowData[1]}`);
    };

    redirectToNewGeofenceForm = () => {
        this.props.push(`${RoutePaths.GeofenceMap.replace(':appName', this.props.selectedProject.name)}`);
    };

    mapGeofencesToTableGeofences(geofences: Array<CircleGeofence | PolygonGeofence>): Array<Array<string>> {
        const tableGeofences = new Array<Array<string>>();
        if (geofences) {
            geofences.forEach((value) => {
                tableGeofences.push([
                    value.enabled ? 'Enabled' : 'Disabled',
                    value.externalId,
                    value.description,
                    value.shape == ShapePicker.CIRCLE ? 'Circle' : 'Polygon',
                    value.onEnter ? 'True' : 'False',
                    value.onExit ? 'True' : 'False',
                ]);
            });
        }
        return tableGeofences;
    }

    booleanRender = (value: string, trueValue: string): JSX.Element => {
        return value === trueValue ? (
            <React.Fragment>
                <CheckCircleIcon style={{ fontSize: 22 }} className={this.props.classes.tableIcon} color="primary" />
                {value}
            </React.Fragment>
        ) : (
            <React.Fragment>
                <HighlightOffIcon style={{ fontSize: 22 }} className={this.props.classes.tableIcon} color="error" />
                {value}
            </React.Fragment>
        );
    };

    requestTableGeofences = (search: string, page: number, sortOrder: MuiDatatablesSortType, pageCount: number) => {
        geofencesService.getPaginatedGeofences(this.props.selectedProject.id, sortOrder.name, sortOrder.direction, page, pageCount, search).then((res) => {
            if (res.isError) {
                this.setState({ wasError: true });
            } else {
                var totalCount = Number(res.headers.get('x-total-count'));
                this.setState({ count: totalCount });
                this.props.setGeofences(res.result);
            }
        });
    };

    columns = [
        {
            name: 'Enabled',
            options: {
                filter: false,
                customBodyRender: (value: string) => {
                    return this.booleanRender(value, 'Enabled');
                },
            },
        },
        {
            name: 'ExternalId',
            options: {
                filter: false,
            },
        },
        {
            name: 'Description',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: 'Shape',
            options: {
                filter: false,
            },
        },
        {
            name: 'On Enter',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: string) => {
                    return this.booleanRender(value, 'True');
                },
            },
        },
        {
            name: 'On Exit',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: string) => {
                    return this.booleanRender(value, 'True');
                },
            },
        },
    ];

    onTableChange = (action: string, tableState: any) => {
        console.log(action, tableState);
        switch (action) {
            case 'changePage': {
                this.setState({ wasError: false });
                this.props.resetTableGeofences();
                this.props.setPage(tableState.page);
                this.requestTableGeofences(tableState.searchText ?? '', tableState.page, tableState.sortOrder, tableState.rowsPerPage);
                break;
            }
            case 'sort': {
                this.setState({ wasError: false });
                this.props.resetTableGeofences();
                if (this.props.orderBy.toLowerCase() !== (tableState.sortOrder as MuiDatatablesSortType).name.toLowerCase()) {
                    this.props.setOrderBy(tableState.sortOrder.name);
                }
                if (this.props.setSortOrder !== tableState.sortOrder.direction) {
                    this.props.setSortOrder(tableState.sortOrder.direction);
                }
                this.requestTableGeofences(tableState.searchText ?? '', tableState.page, tableState.sortOrder, tableState.rowsPerPage);
                break;
            }
            case 'changeRowsPerPage': {
                this.setState({ wasError: false });
                this.props.resetTableGeofences();
                this.props.setPageCount(tableState.rowsPerPage);
                this.requestTableGeofences(tableState.searchText ?? '', tableState.page, tableState.sortOrder, tableState.rowsPerPage);
                break;
            }
            case 'searchChange': {
                this.setState({ wasError: false });
                this.props.resetTableGeofences();
                this.props.setPage(tableState.page);
                this.props.setPageCount(tableState.rowsPerPage);
                this.props.setOrderBy('ExternalId');
                this.props.setSortOrder('asc');
                this.requestTableGeofences(
                    tableState.searchText ?? '',
                    0,
                    { name: 'ExternalId', direction: 'asc' } as MuiDatatablesSortType,
                    tableState.rowsPerPage
                );
                break;
            }
            default: {
                break;
            }
        }
    };

    render() {
        const { classes, geofencesState } = this.props;
        const options = {
            textLabels: {
                body: {
                    noMatch: this.props.geofencesState.isTableLoaded ? 'Your organization has not created any geofences yet.' : 'Loading...',
                },
            },
            print: false,
            download: false,
            customToolbar: () => {
                return <CustomAddToolbar toggleFormFlag={this.redirectToNewGeofenceForm} />;
            },
            serverSide: true,
            count: this.state.count,
            rowsPerPage: this.props.pageCount,
            rowsPerPageOptions: [25, 50, 75, 100, 500],
            filter: false,
            elevation: 3,
            selectableRows: 'none',
            responsive: 'vertical',
            viewColumns: false,
            onRowClick: this.editGeofence,
            customSearchRender: debounceSearchRender(500),
            onTableChange: (action: string, tableState: any) => {
                this.onTableChange(action, tableState);
            },
        };
        return (
            <Grid className={classes.grid} container justify="center" alignItems="center">
                <Grid item xs={12}>
                    <MUIDataTable
                        title={
                            <Typography variant="h6">
                                Geofences
                                {!geofencesState.isTableLoaded && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                            </Typography>
                        }
                        data={this.mapGeofencesToTableGeofences(geofencesState.tableGeofences)}
                        columns={this.columns}
                        options={options}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateIntegrationsHOC(populateTableGeofencesHOC(Geofences))));
