import * as React from "react";
import UserManager from "../../../services/UserManager";
import { push } from "connected-react-router";
import { connect } from "react-redux";

interface LoginRedirectProps {
    push: typeof push;
    domain: string;
}

function LoginRedirect(props: LoginRedirectProps): any {
    const domains = window.location.hostname.split(".");
    if (domains.length === 3) {
        const domain = domains[0];
        const redirectUri = "http://" + domain + "." + SERVER_HOST + "/callback";
        UserManager.signinRedirect({ acr_values: "tenant:" + domain, redirect_uri: redirectUri });
        return <div>Redirecting to Identity Server</div>;
    } else {
        props.push("/enterdomain");
        return null;
    }
}

export default connect(
    null,
    { push }
)(LoginRedirect);
