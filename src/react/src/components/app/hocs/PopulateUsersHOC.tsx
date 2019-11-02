import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import populateProjectsHOC from './PopulateProjectsHOC';
import Loading from '../loading/Loading';
import IUser from '../../../models/app/IUser';
import { populateUsers, UsersState } from '../../../redux/actions/UserActions';
import UserService from '../../../services/UserService';

const userService = new UserService();

interface PopulateUsersComponentProps {
    setUsers: (users: IUser[]) => void;
    usersState: UsersState;
}

const mapStateToProps = (state: ApplicationState) => {
    return { usersState: state.usersState, user: state.oidc.user };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setUsers: (users: IUser[]) => {
            const action = populateUsers(users);
            dispatch(action);
        },
    };
};

const populateUsersHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateUsersComponent extends React.Component<PopulateUsersComponentProps> {
        componentDidMount() {
            if (!this.props.usersState.isLoaded) {
                userService.getUsers().then(userResponse => {
                    setTimeout(() => {
                        this.props.setUsers(userResponse.content);
                    }, 350);
                });
            }
        }

        render() {
            return this.props.usersState.isLoaded ? <Component {...(this.props as P)} /> : <Loading message="Retrieving users." />;
        }
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(PopulateUsersComponent);
};

export default populateUsersHOC;
