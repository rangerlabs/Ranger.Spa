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
        parentStyle: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            boxSizing: 'border-box',
            display: 'block',
            width: '100%',
        },
        cellStyle: {
            boxSizing: 'border-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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
    totalCount: number;
    setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>, totalCount: number) => void;
    setPage: (page: number) => void;
    setPageCount: (pageCount: number) => void;
    setOrderBy: (orderBy: OrderByOptions) => void;
    setSortOrder: (sortOrder: SortOrder) => void;
    resetTableGeofences: () => void;
}

interface LocalGeofencesState {
    wasError: boolean;
    isSearching: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        geofencesState: state.geofencesState,
        selectedProject: state.selectedProject,
        sortOrder: state.geofencesState.sortOrder,
        orderBy: state.geofencesState.orderBy,
        page: state.geofencesState.page,
        pageCount: state.geofencesState.pageCount,
        totalCount: state.geofencesState.totalCount,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        push: (path: string) => dispatch(push(path)),
        setGeofences: (geofences: Array<CircleGeofence | PolygonGeofence>, totalCount: number) => {
            const action = populateTableGeofences(geofences, totalCount);
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
        isSearching: false,
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
                    this.getTriggerText(value.onEnter, value.onDwell, value.onExit),
                    value.createdDate.toDateString(),
                    value.updatedDate.toDateString(),
                ]);
            });
        }
        return tableGeofences;
    }

    getTriggerText(entered: boolean, dwelling: boolean, exited: boolean): string {
        var enabled = new Array<string>();
        if (entered) {
            enabled.push('Enter');
        }
        if (dwelling) {
            enabled.push('Dwell');
        }
        if (exited) {
            enabled.push('Exit');
        }
        return enabled.join(' / ');
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
                this.setState({ wasError: true, isSearching: false });
            } else {
                var totalCount = Number.parseInt(res.headers.get('x-pagination-totalcount'));
                this.props.setGeofences(res.result, totalCount);
            }
        });
    };

    onTableChange = (action: string, tableState: any) => {
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
            case 'search': {
                if (tableState.searchText) {
                    this.setState({ isSearching: true });
                }
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
            case 'searchClose': {
                this.setState({ isSearching: false });
                break;
            }
            default: {
                break;
            }
        }
    };

    getNoMatchForCurrentState() {
        if (this.props.geofencesState.isTableLoaded && !this.state.isSearching && !this.props.totalCount) {
            return 'Your organization has not created any geofences yet.';
        } else if (this.props.geofencesState.isTableLoaded && this.state.isSearching && !this.props.totalCount) {
            return 'No geofences found beginning with the provided search.';
        } else if (!this.props.geofencesState.isTableLoaded && this.state.wasError && !this.state.isSearching) {
            return 'Invalid search. Search characters must be alphanumeric or dashes.';
        }
        return 'Loading...';
    }

    overflowRender(val: string) {
        return (
            <div style={{ position: 'relative', height: '20px' }}>
                <div className={this.props.classes.parentStyle}>
                    <div className={this.props.classes.cellStyle}>{val}</div>
                </div>
            </div>
        );
    }

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
            label: 'External Id',
            options: {
                filter: false,
            },
        },
        {
            name: 'Description',
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value: string) => this.overflowRender(value),
            },
        },
        {
            name: 'Shape',
            options: {
                filter: false,
            },
        },
        {
            name: 'Integration Triggers',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: 'CreatedDate',
            label: 'Created Date',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: 'UpdatedDate',
            label: 'Updated Date',
            options: {
                filter: false,
                sort: true,
            },
        },
    ];
    render() {
        const { classes, geofencesState } = this.props;

        const options = {
            textLabels: {
                body: {
                    noMatch: this.getNoMatchForCurrentState(),
                },
            },
            serverSide: true,
            print: false,
            download: false,
            filter: false,
            jumpToPage: true,
            elevation: 3,
            resizableColumns: true,
            selectableRows: 'none',
            responsive: 'vertical',
            count: this.props.totalCount,
            rowsPerPage: this.props.pageCount,
            rowsPerPageOptions: [25, 50, 75, 100, 500],
            sortOrder: { name: this.props.orderBy, direction: this.props.sortOrder } as MuiDatatablesSortType,
            onRowClick: this.editGeofence,
            customSearchRender: debounceSearchRender(500),
            customToolbar: () => {
                return <CustomAddToolbar toggleFormFlag={this.redirectToNewGeofenceForm} />;
            },
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
