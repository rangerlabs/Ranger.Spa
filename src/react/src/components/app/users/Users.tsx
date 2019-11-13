import * as React from 'react';
import IUser from '../../../models/app/IUser';
import CustomAddToolbar from '../muiDataTable/CustomAddToolbar';
import { connect } from 'react-redux';
import { addUser, removeUser } from '../../../redux/actions/UserActions';
import { ApplicationState } from '../../../stores/index';
import { push } from 'connected-react-router';
import { User } from 'oidc-client';
import { UserProfile } from '../../../models/UserProfile';
import populateUsersHOC from '../hocs/PopulateUsersHOC';
import { StatusEnum } from '../../../models/StatusEnum';
const MUIDataTable = require('mui-datatables').default;

interface UsersProps {
    users: IUser[];
    addUser: (user: IUser) => void;
    removeUser: (email: string) => void;
    push: typeof push;
    user: User;
}

const mapStateToProps = (state: ApplicationState) => {
    return { users: state.usersState.users, user: state.oidc.user };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        addUser: (user: IUser) => {
            const action = addUser(user);
            dispatch(action);
        },
        removeUser: (email: string) => {
            const action = removeUser(email);
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
            users.forEach(value => {
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
        print: false,
        download: false,
        customToolbar: () => {
            return <CustomAddToolbar toggleFormFlag={this.redirectToNewUserForm} />;
        },
        elevation: 0,
        selectableRows: 'none',
        responsive: 'stacked',
        viewColumns: false,
        onRowClick: this.editUser,
    };

    render() {
        const { users } = this.props;
        return <MUIDataTable title={'Users'} data={this.mapUsersToTableUsers(users)} columns={this.columns} options={this.options} />;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(populateUsersHOC(Users));
