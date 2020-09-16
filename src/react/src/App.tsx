import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { Route } from 'react-router';
import Routes from './components/Routes';
import { connect } from 'react-redux';
import { ApplicationState } from './stores';
import { User } from 'oidc-client';
import { UserProfile } from './models/UserProfile';
import * as FullStory from '@fullstory/browser';

const mapStateToProps = (state: ApplicationState) => {
    return { domain: state.organizationState.domain, user: state.oidc.user };
};
interface AppProps {
    domain: string;
    user: User;
}
const App = (props: AppProps) => {
    React.useEffect(() => {
        if (props.domain && props.user && !props.user.expired) {
            FullStory.identify(`${props.domain}_${props.user.profile.email}`, {
                role: (props.user.profile as UserProfile).role,
                authorizedProjects: (props.user.profile as UserProfile).authorizedProjects,
            });
        }
    }, [props.domain, props.user]);
    return <Route path="*" render={(props) => <Routes {...props} />} />;
};

export default connect(mapStateToProps)(App);
