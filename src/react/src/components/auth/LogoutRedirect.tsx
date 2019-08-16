import * as React from "react";
import UserManager from "../../services/UserManager";
import { ApplicationState } from "../../stores";
import { push } from "connected-react-router";
import { connect } from "react-redux";

interface LogoutRedirectProps {
    user: Oidc.User;
    isLoadingUser: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        user: state.oidc.user,
        isLoadingUser: state.oidc.isLoadingUser,
    };
};

function LogoutRedirect(props: LogoutRedirectProps): any {
    if (!props.isLoadingUser) {
        if (props.user) {
            const idTokenHint = props.user.id_token;
            UserManager.signoutRedirect({ id_token_hint: idTokenHint });
            return <h1>Logging out...</h1>;
        }
        return <h1>Logging out from Ranger.</h1>;
    }
    return null;
}

export default connect(
    mapStateToProps,
    null
)(LogoutRedirect);
