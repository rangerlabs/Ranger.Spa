import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import Loading from '../loading/Loading';
import IUser from '../../../models/app/IUser';
import { populateUsers, UsersState } from '../../../redux/actions/UserActions';
import UserService from '../../../services/UserService';

const userService = new UserService();

interface PopulateUsersComponentProps {
    setUsers: (users: IUser[]) => void;
    usersState: UsersState;
}
interface PopulateUsersComponentState {
    wasError: boolean;
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
    class PopulateUsersComponent extends React.Component<PopulateUsersComponentProps, PopulateUsersComponentState> {
        state: PopulateUsersComponentState = {
            wasError: false,
        };
        componentDidMount() {
            if (!this.props.usersState.isLoaded) {
                userService.getUsers().then((userResponse) => {
                    if (userResponse.isError) {
                        this.setState({ wasError: true });
                    } else {
                        this.props.setUsers(userResponse.result ? userResponse.result : new Array<IUser>());
                    }
                });
            }
        }

        render() {
            return this.props.usersState.isLoaded && !this.state.wasError ? <Component {...(this.props as P)} /> : <Loading wasError={this.state.wasError} />;
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(PopulateUsersComponent);
};

export default populateUsersHOC;
