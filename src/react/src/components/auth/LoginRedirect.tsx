import * as React from "react";
import UserManager from "../../services/UserManager";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import RoutePaths from "../RoutePaths";

interface LoginRedirectProps {
    push: typeof push;
    domain: string;
}

function LoginRedirect(props: LoginRedirectProps): any {
    const domains = window.location.hostname.split(".");
    if (domains.length === 3) {
        const domain = domains[0];
        const redirectUri = "http://" + domain + "." + SPA_HOST + BASE_PATH + "/callback";
        UserManager.signinRedirect({ acr_values: "tenant:" + domain, redirect_uri: redirectUri, data: { redirectUrl: RoutePaths.Home } });
        return <h1>Redirecting to Identity Server</h1>;
    } else {
        props.push("/enterdomain");
        return null;
    }
}

export default connect(
    null,
    { push }
)(LoginRedirect);
