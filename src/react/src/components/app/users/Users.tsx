import * as React from 'react';
import IUser from '../../../models/app/IUser';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addUser } from '../../../redux/actions/UserActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import { User } from 'oidc-client';
import { UserProfile } from '../../../models/UserProfile';
import populateUsersHOC from '../hocs/PopulateUsersHOC';
import { Grid, Theme, createStyles, withStyles, WithStyles, TableFooter, Paper, Typography } from '@material-ui/core';
const MUIDataTable = require('mui-datatables').default;

const styles = (theme: Theme) =>
    createStyles({
        layout: {
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginTop: theme.toolbar.height,
            [theme.breakpoints.up(600 + theme.spacing(2 * 2))]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        paper: {
            padding: theme.spacing(4),
        },
        grid: {
            padding: theme.spacing(2),
        },
        footer: {
            display: 'block',
            height: '54px',
        },
    });

interface UsersProps extends WithStyles<typeof styles> {
    users: IUser[];
    addUser: (user: IUser) => void;
    push: typeof push;
    user: User;
    canAccessUsersPage: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        users: state.usersState.users,
        user: state.oidc.user,
        canAccessUsersPage: state.subscriptionLimitDetailsState.subscriptionLimitDetails.limit.accounts > 1 || state.usersState.users.length > 1,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addUser: (user: IUser) => {
            const action = addUser(user);
            dispatch(action);
        },
        push: (path: string) => dispatch(push(path)),
    };
};

class Users extends React.Component<UsersProps> {
    refs: {
        query: HTMLInputElement;
    };

    state = {
        editUser: null as IUser,
        displayNewUserFormFlag: false,
    };

    editUser = (rowData: string[]) => {
        const user = {
            firstName: rowData[0],
            lastName: rowData[1],
            email: rowData[2],
            role: rowData[3],
        } as IUser;
        this.props.push('/users/edit?email=' + encodeURI(user.email));
    };

    redirectToNewUserForm = () => {
        this.props.push('/users/new');
    };

    mapUsersToTableUsers(users: IUser[]): Array<Array<string>> {
        let tableUsers = new Array<Array<string>>();
        if (users) {
            users.forEach((value) => {
                if (value.email !== (this.props.user.profile as UserProfile).email) {
                    let status = value.emailConfirmed ? 'Active' : 'Inactive';
                    tableUsers.push([value.firstName, value.lastName, value.email, value.role, status]);
                }
            });
        }
        return tableUsers;
    }

    columns = [
        {
            name: 'Firstname',
            options: {
                filter: false,
            },
        },
        {
            name: 'Lastname',
            options: {
                filter: false,
                sortDirection: 'asc',
            },
        },
        {
            name: 'Email',
            options: {
                filter: false,
            },
        },
        {
            name: 'Role',
            options: {
                filter: true,
            },
        },
        {
            name: 'Status',
            options: {
                filter: true,
            },
        },
    ];
    options = {
        textLabels: {
            body: {
                noMatch: 'Your organization has not created any users yet.',
            },
        },
        print: false,
        download: false,

        customToolbar: () => {
            return <CustomAddToolbar toggleFormFlag={this.redirectToNewUserForm} />;
        },
        customFooter: this.props.users?.length > 10 ? null : () => <TableFooter className={this.props.classes.footer} />,
        elevation: 3,
        selectableRows: 'none',
        responsive: 'vertical',
        viewColumns: false,
        tableBodyMaxHeight: 'calc(100vh - 64px - 48px - 64px - 52px)',
        onRowClick: this.editUser,
    };

    render() {
        const { classes, users, canAccessUsersPage } = this.props;
        return canAccessUsersPage ? (
            <Grid className={classes.grid} container justify="center" alignItems="center">
                <Grid item xs={12}>
                    <MUIDataTable title={'Users'} data={this.mapUsersToTableUsers(users)} columns={this.columns} options={this.options} />
                </Grid>
            </Grid>
        ) : (
            <main className={classes.layout}>
                <Paper className={classes.paper} elevation={3}>
                    <Typography align="center" variant="h5" gutterBottom>
                        This page is unavailable for your current subscription. Please upgrade your subscription to access this page.
                    </Typography>
                </Paper>
            </main>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(populateUsersHOC(Users)));
