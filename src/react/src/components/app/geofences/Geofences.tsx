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
    resetTableGeofences,
    setPendingBulkOperation,
    addGeofencesToPendingDeletion,
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
import { openDialog, DialogContent } from '../../../redux/actions/DialogActions';
import CustomRefreshToolbar from '../muiDataTable/CustomRefreshToolbar';
import GeofenceBulkDelete from '../../../models/app/geofences/GeofenceBulkDelete';
import CorrelationModel from '../../../models/CorrelationModel';
import { StatusEnum } from '../../../models/StatusEnum';
import Constants from '../../../theme/Constants';
const MUIDataTable = require('mui-datatables').default;
const debounceSearchRender = require('mui-datatables').debounceSearchRender;

const styles = (theme: Theme) =>
    createStyles({
        grid: {
            padding: theme.spacing(2),
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
        pendingDelete: {
            backgroundColor: '#ff000026 !important',
        },
        warning: {
            color: Constants.COLORS.WARNING,
        },
    });

const geofencesService = new GeofenceService();

type MuiDatatablesSortType = {
    name: OrderByOptions;
    direction: SortOrder;
};

type RowsDeleted = {
    data: DeletedRow[];
    lookup: boolean[];
};

type DeletedRow = {
    index: number;
    dataIndex: number;
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
    openDialog: (dialogContent: DialogContent) => void;
    setPendingBulkOperation: (isPending: boolean) => void;
    setPendingDeleteGeofences: (geofences: (CircleGeofence | PolygonGeofence)[]) => void;
}

interface LocalGeofencesState {
    wasError: boolean;
    isSearching: boolean;
    completedBulkDelete: boolean;
    bulkOperationMsg: JSX.Element;
    selectedRows: number[];
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
        openDialog: (dialogContent: DialogContent) => {
            const action = openDialog(dialogContent);
            dispatch(action);
        },
        setPendingBulkOperation: (isPending: boolean) => {
            const action = setPendingBulkOperation(isPending);
            dispatch(action);
        },
        setPendingDeleteGeofences: (geofences: (CircleGeofence | PolygonGeofence)[]) => {
            const action = addGeofencesToPendingDeletion(geofences);
            dispatch(action);
        },
    };
};

class Geofences extends React.Component<GeofencesProps, LocalGeofencesState> {
    state: LocalGeofencesState = {
        wasError: false,
        isSearching: false,
        completedBulkDelete: false,
        bulkOperationMsg: null,
        selectedRows: [],
    };

    refs: {
        query: HTMLInputElement;
    };

    geofenceService = new GeofenceService();

    componentWillUnmount() {
        this.props.resetTableGeofences();
    }

    componentWillMount() {
        if (this.props.geofencesState.isPendingBulkOperation) {
            this.setState({
                bulkOperationMsg: this.bulkInProgressElement,
            });
        } else {
            this.props.setPendingDeleteGeofences(new Array<CircleGeofence | PolygonGeofence>());
        }
    }

    componentDidUpdate = (prevProps: GeofencesProps) => {
        if (prevProps && prevProps.geofencesState.isPendingBulkOperation && !this.props.geofencesState.isPendingBulkOperation) {
            this.setState({
                completedBulkDelete: true,
                bulkOperationMsg: this.bulkCompleteElement,
            });
        }
    };

    bulkInProgressElement = (
        <React.Fragment>
            <Typography display="inline" className={this.props.classes.warning}>
                <CircularProgress className={this.props.classes.warning} size={12} style={{ marginRight: 15, position: 'relative' }} />A bulk operation is in
                progress, the resources below may change soon.
            </Typography>
        </React.Fragment>
    );

    bulkCompleteElement = (<Typography color="primary">The bulk operation is complete, refresh the table to view the updated resources.</Typography>);

    editGeofence = (rowData: string[]) => {
        var externalId = rowData[1];
        if (this.props.geofencesState.pendingDeletion.findIndex((g) => g.externalId === externalId) === -1) {
            this.props.push(`${RoutePaths.GeofencesEdit.replace(':appName', this.props.selectedProject.name)}?name=${rowData[1]}`);
        }
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

    getBulkDeleteWarning(count: number, continueAction: Function): DialogContent {
        return new DialogContent(
            `Are you sure you want to delete all ${count} selected geofences? The cannot be undone.`,
            `Delete ${count} Geofences?`,
            'Bulk Delete',
            continueAction
        );
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
            <CheckCircleIcon style={{ fontSize: 22 }} className={this.props.classes.tableIcon} color="primary" />
        ) : (
            <HighlightOffIcon style={{ fontSize: 22 }} className={this.props.classes.tableIcon} color="error" />
        );
    };

    requestTableGeofences = (search: string, page: number, sortOrder: MuiDatatablesSortType, pageCount: number) => {
        if (this.state.completedBulkDelete) {
            this.props.setPendingDeleteGeofences(new Array<CircleGeofence | PolygonGeofence>());
            this.setState({ completedBulkDelete: false, bulkOperationMsg: null });
        }
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
        console.log(action, tableState);
        switch (action) {
            case 'changePage': {
                this.changePage(tableState);
                this.setState({ selectedRows: [] });
                break;
            }
            case 'sort': {
                this.sort(tableState);
                this.setState({ selectedRows: [] });
                break;
            }
            case 'changeRowsPerPage': {
                this.changeRowsPerPage(tableState);
                this.setState({ selectedRows: [] });
                break;
            }
            case 'search': {
                this.search(tableState);
                this.setState({ selectedRows: [] });
                break;
            }
            case 'searchClose': {
                this.setState({ isSearching: false });
                break;
            }
            case 'rowSelectionChange': {
                this.setState({ selectedRows: (tableState.selectedRows.data as any[]).map((_) => _.index) });
                break;
            }
            default: {
                break;
            }
        }
    };

    private refresh() {
        this.setState({ selectedRows: [] });
        this.props.resetTableGeofences();
        this.requestTableGeofences(
            '',
            this.props.page,
            { name: this.props.orderBy, direction: this.props.sortOrder } as MuiDatatablesSortType,
            this.props.pageCount
        );
    }

    private delete(rowsDeleted: RowsDeleted) {
        const selectedGeofences = new Array<CircleGeofence | PolygonGeofence>();
        rowsDeleted.data.forEach((r) => selectedGeofences.push(this.props.geofencesState.tableGeofences[r.index]));

        this.props.openDialog(
            new DialogContent(
                `Are you sure you want to delete the ${selectedGeofences.length} selected geofence(s)? This cannot be undone.`,
                `Delete ${selectedGeofences.length} Geofence(s)?`,
                'Delete',
                () => {
                    this.props.setPendingBulkOperation(true);
                    this.setState({
                        selectedRows: [],
                        bulkOperationMsg: this.bulkInProgressElement,
                    });
                    const geofenceBulkDeleteRequest = { externalIds: selectedGeofences.map((g) => g.externalId) } as GeofenceBulkDelete;
                    this.geofenceService.bulkDeleteGeofences(this.props.selectedProject.id, geofenceBulkDeleteRequest).then((response) => {
                        if (response.isError) {
                            //display an error
                        } else {
                            selectedGeofences.forEach(
                                (v) => (v.correlationModel = { correlationId: response.correlationId, status: StatusEnum.PENDING } as CorrelationModel)
                            );
                            this.props.setPendingDeleteGeofences(selectedGeofences);
                        }
                    });
                },
                true
            )
        );
        return false;
    }

    private search(tableState: any) {
        if (tableState.searchText) {
            this.setState({ isSearching: true });
        }
        this.setState({ wasError: false });
        this.props.resetTableGeofences();
        this.props.setPage(tableState.page);
        this.props.setPageCount(tableState.rowsPerPage);
        this.props.setOrderBy('ExternalId');
        this.props.setSortOrder('asc');
        this.requestTableGeofences(tableState.searchText ?? '', 0, { name: 'ExternalId', direction: 'asc' } as MuiDatatablesSortType, tableState.rowsPerPage);
    }

    private changePage(tableState: any) {
        this.setState({ wasError: false });
        this.props.resetTableGeofences();
        this.props.setPage(tableState.page);
        this.requestTableGeofences(tableState.searchText ?? '', tableState.page, tableState.sortOrder, tableState.rowsPerPage);
    }

    private sort(tableState: any) {
        this.setState({ wasError: false });
        this.props.resetTableGeofences();
        if (this.props.orderBy.toLowerCase() !== (tableState.sortOrder as MuiDatatablesSortType).name.toLowerCase()) {
            this.props.setOrderBy(tableState.sortOrder.name);
        }
        if (this.props.setSortOrder !== tableState.sortOrder.direction) {
            this.props.setSortOrder(tableState.sortOrder.direction);
        }
        this.requestTableGeofences(tableState.searchText ?? '', tableState.page, tableState.sortOrder, tableState.rowsPerPage);
    }

    private changeRowsPerPage(tableState: any) {
        this.setState({ wasError: false });
        this.props.resetTableGeofences();
        this.props.setPageCount(tableState.rowsPerPage);
        this.requestTableGeofences(tableState.searchText ?? '', tableState.page, tableState.sortOrder, tableState.rowsPerPage);
    }

    private getNoMatchForCurrentState() {
        if (this.props.geofencesState.isTableLoaded && !this.state.isSearching && !this.props.totalCount) {
            return 'Your organization has not created any geofences yet.';
        } else if (this.props.geofencesState.isTableLoaded && this.state.isSearching && !this.props.totalCount) {
            return 'No geofences found beginning with the provided search.';
        } else if (!this.props.geofencesState.isTableLoaded && this.state.wasError && !this.state.isSearching) {
            return 'Invalid search. Search characters must be alphanumeric or dashes.';
        }
        return 'Loading...';
    }

    private setRowProps(row: any[], dataIndex: number, rowIndex: number) {
        return {
            className: this.isPendingDelete(rowIndex) ? this.props.classes.pendingDelete : '',
        };
    }

    private overflowRender(val: string) {
        return (
            <div style={{ position: 'relative', height: '20px' }}>
                <div className={this.props.classes.parentStyle}>
                    <div className={this.props.classes.cellStyle}>{val}</div>
                </div>
            </div>
        );
    }

    private isPendingDelete(index: number) {
        if (this.props.geofencesState.tableGeofences.length) {
            return this.props.geofencesState.pendingDeletion.findIndex((v) => v.id === this.props.geofencesState.tableGeofences[index].id) === -1
                ? false
                : true;
        }
        return false;
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
            responsive: 'vertical',
            count: this.props.totalCount,
            page: this.props.page,
            rowsSelected: this.state.selectedRows,
            rowsPerPage: this.props.pageCount,
            rowsPerPageOptions: [25, 50, 75, 100, 500],
            sortOrder: { name: this.props.orderBy, direction: this.props.sortOrder } as MuiDatatablesSortType,
            customSearchRender: debounceSearchRender(500),
            tableBodyMaxHeight: 'calc(100vh - 64px - 48px - 64px - 52px)',
            onRowClick: (rowData: string[]) => this.editGeofence(rowData),
            setRowProps: (row: any[], dataIndex: number, rowIndex: number) => this.setRowProps(row, dataIndex, rowIndex),
            isRowSelectable: (index: number) => !this.isPendingDelete(index),
            onRowsDelete: (rows: RowsDeleted) => this.delete(rows),
            customToolbar: () => {
                return (
                    <React.Fragment>
                        <CustomRefreshToolbar onClick={() => this.refresh()} />
                        <CustomAddToolbar onClick={this.redirectToNewGeofenceForm} />
                    </React.Fragment>
                );
            },
            onTableChange: (action: string, tableState: any) => {
                this.onTableChange(action, tableState);
            },
        };
        return (
            <Grid className={classes.grid} container justify="center" alignItems="center">
                <Grid item xs={12}>
                    <MUIDataTable
                        className={classes.grid}
                        title={
                            <React.Fragment>
                                <Typography variant="h6">
                                    Geofences
                                    {!geofencesState.isTableLoaded && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                                </Typography>
                                {Boolean(this.state.bulkOperationMsg) && this.state.bulkOperationMsg}
                            </React.Fragment>
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
