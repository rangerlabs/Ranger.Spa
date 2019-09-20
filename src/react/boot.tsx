import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApplicationState } from "./src/stores/index";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { OidcProvider } from "redux-oidc";
import { history } from "./src/History";
import UserManager from "./src/services/UserManager";
import ReduxStore from "./src/ReduxStore";
import createRangerTheme from "./src/theme/createMyTheme";
import App from "./src/App";
import "whatwg-fetch";
import "./polyfills/object-assign";
import "./polyfills/array-find";
import "./src/index.css";
import { AppContainer } from "react-hot-loader";
import SnackbarProviderWrapper from "./src/components/SnackbarProviderWrapper/SnackbarProviderWrapper";
import { MuiThemeProvider } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const initialState = {} as ApplicationState;
ReduxStore.Configure(history, initialState);
const store = ReduxStore.getStore();

const theme = createRangerTheme({
    palette: {
        type: "light",
        primary: {
            main: "#7e57c2",
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
        fontSize: 16,
        fontWeightLight: 100,
        fontWeightRegular: 300,
        fontWeightMedium: 400,
        fontWeightBold: 400,
    },
});

ReactDOM.render(
    <Provider store={store}>
        <OidcProvider store={store} userManager={UserManager}>
            <ThemeProvider theme={theme}>
                <SnackbarProviderWrapper>
                    <ConnectedRouter history={history}>
                        <App />
                    </ConnectedRouter>
                </SnackbarProviderWrapper>
            </ThemeProvider>
        </OidcProvider>
    </Provider>,
    document.getElementById("app")
);
