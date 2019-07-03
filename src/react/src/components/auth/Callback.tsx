import * as React from "react";
import UserManager from "../../services/UserManager";
import { User } from "oidc-client";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { CallbackComponent } from "redux-oidc";
import RoutePaths from "../RoutePaths";

class Callback extends React.Component<RouteComponentProps<{}> & { dispatch: any }, {}> {
    successCallback = (user: User) => {
        // get the user's previous location, passed during signinRedirect()
        var redirectPath = user.state.path as string;
        redirectPath = RoutePaths.Home;
        this.props.dispatch(push(redirectPath));
    };

    errorCallback = (error: Error) => {
        console.log(error);
        this.props.dispatch(push("/"));
    };

    render() {
        return (
            <CallbackComponent userManager={UserManager} successCallback={this.successCallback} errorCallback={this.errorCallback}>
                <div>Loading...</div>
            </CallbackComponent>
        );
    }
}

export default connect()(Callback);
