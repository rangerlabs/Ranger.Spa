import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApplicationState } from "./src/stores/index";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { OidcProvider } from "redux-oidc";
import { history } from "./src/History";
import UserManager from "./src/services/UserManager";
import ReduxStore from "./src/ReduxStore";
import createCamelCaseTheme from "./src/theme/createMyTheme";
import App from "./src/App";
import "whatwg-fetch";
import "./polyfills/object-assign";
import "./polyfills/array-find";
import "./src/index.css";
import { AppContainer } from "react-hot-loader";
import SnackbarProviderWrapper from "./src/components/SnackbarProviderWrapper/SnackbarProviderWrapper";

const initialState = {} as ApplicationState;
ReduxStore.Configure(history, initialState);
const store = ReduxStore.getStore();

const theme = createCamelCaseTheme({
    palette: {
        type: "light",
        primary: {
            main: "#7e57c2",
        },
        secondary: {
            main: "#ffa726",
        },
        text: {
            primary: "#000000",
        },
        background: {
            paper: "#FFFFFF",
            default: "#FFFFFF",
        },
    },
    typography: {
        useNextVariants: true,
    },
});

ReactDOM.render(
    <Provider store={store}>
        <OidcProvider store={store} userManager={UserManager}>
            <MuiThemeProvider theme={theme}>
                <SnackbarProviderWrapper>
                    <ConnectedRouter history={history}>
                        <App />
                    </ConnectedRouter>
                </SnackbarProviderWrapper>
            </MuiThemeProvider>
        </OidcProvider>
    </Provider>,
    document.getElementById("app")
);
