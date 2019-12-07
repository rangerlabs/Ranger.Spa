import * as React from 'react';
import { ApplicationState } from '../../../stores';
import { connect } from 'react-redux';
import populateProjectsHOC from './PopulateProjectsHOC';
import Loading from '../loading/Loading';
import IUser from '../../../models/app/IUser';
import { populateUsers, UsersState } from '../../../redux/actions/UserActions';
import UserService from '../../../services/UserService';
import * as queryString from 'query-string';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import { User } from 'oidc-client';
import { UserProfile } from '../../../models/UserProfile';

const userService = new UserService();

interface PopulateUserProps {
    user: User;
    push: typeof push;
}

interface PopulateUserState {
    isLoaded: boolean;
    user: IUser;
}

const mapStateToProps = (state: ApplicationState) => {
    return { user: state.oidc.user };
};

const populateUserAuthorizedProjectsHOC = <P extends object>(Component: React.ComponentType<P>) => {
    class PopulateUserAuthorizedProjectsComponent extends React.Component<PopulateUserProps, PopulateUserState> {
        state = {
            isLoaded: false,
            user: undefined as IUser,
        };

        setInitialUserInStateFromQuery() {
            const params = queryString.parse(window.location.search);
            const email = params['email'] as string;
            if (email) {
                if (!this.state.isLoaded) {
                    userService.getUser(email).then(v => {
                        if (!v.is_error) {
                            if (v.content.email !== (this.props.user.profile as UserProfile).email) {
                                userService.getAuthorizedProjects(email).then(ap => {
                                    if (!ap.is_error) {
                                        const user = { ...v.content, authorizedProjects: ap.content };
                                        setTimeout(() => {
                                            this.setState({ user: user, isLoaded: true });
                                        }, 250);
                                    }
                                });
                            } else {
                                this.props.push(RoutePaths.Users);
                            }
                        }
                    });
                } else {
                    this.setState({ isLoaded: true });
                }
            }
        }

        componentDidMount() {
            this.setInitialUserInStateFromQuery();
        }

        render() {
            return this.state.isLoaded ? <Component {...(this.props as P)} initialUser={this.state.user} /> : <Loading message="Retrieving user details." />;
        }
    }

    return connect(mapStateToProps, { push })(PopulateUserAuthorizedProjectsComponent);
};

export default populateUserAuthorizedProjectsHOC;
