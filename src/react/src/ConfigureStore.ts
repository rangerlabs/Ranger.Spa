import { createStore, applyMiddleware, compose, combineReducers, ReducersMapObject } from "redux";
import { routerMiddleware, push } from "connected-react-router";
import { loadUser } from "redux-oidc";
import { ApplicationState } from "./stores/index";
import { History } from "history";
import reducers from "./redux/reducers/index";
import { connectRouter } from "connected-react-router";
import logger from "redux-logger";
import UserManager from "./services/UserManager";
import RoutePaths from "./components/RoutePaths";

export default function ConfigureStore(history: History, initialState?: ApplicationState) {
    UserManager.events.addSilentRenewError(function(error) {
        console.error("Error while renewing the access token.", error);
        const domains = window.location.hostname.split(".");
        if (domains.length === 3) {
            const domain = domains[0];
            const redirectUri = `http://${domain}.${SPA_HOST}/callback`;
            UserManager.signinRedirect({ acr_values: "tenant:" + domain, redirect_uri: redirectUri, data: { redirectUrl: RoutePaths.Dashboard } });
        } else {
            history.push("/");
            return null;
        }
    });

    const rootReducer = buildRootReducer(history, reducers);

    const store = createStore(rootReducer, initialState, compose(applyMiddleware(logger, routerMiddleware(history))));

    loadUser(store, UserManager);

    if (module.hot) {
        module.hot.accept("./redux/reducers/index", () => {
            const nextRootReducer = require("./redux/reducers/index");
            store.replaceReducer(buildRootReducer(history, nextRootReducer));
        });
    }

    return store;
}

function buildRootReducer(history: History, allReducers: ReducersMapObject) {
    return combineReducers<ApplicationState>(Object.assign({}, allReducers, {
        router: connectRouter(history),
    }) as any);
}
