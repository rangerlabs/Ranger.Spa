import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApplicationState } from './src/stores/index';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { history } from './src/History';
import UserManager from './src/services/UserManager';
import ReduxStore from './src/ReduxStore';
import createRangerTheme from './src/theme/createMyTheme';
import App from './src/App';
import 'whatwg-fetch';
import './polyfills/object-assign';
import './polyfills/array-find';
import './src/index.css';
import SnackbarProviderWrapper from './src/components/SnackbarProviderWrapper/SnackbarProviderWrapper';
import { responsiveFontSizes } from '@material-ui/core';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import { jss, generateClassName } from './src/theme/StylesProviderPropsConfig';
import Constants from './src/theme/Constants';

const initialState = {} as ApplicationState;
ReduxStore.Configure(history, initialState);
const store = ReduxStore.getStore();

const theme = responsiveFontSizes(
    createRangerTheme({
        palette: {
            type: 'light',
            primary: {
                main: Constants.COLORS.PRIMARY_COLOR,
            },
            text: {
                primary: '#000000',
            },
            background: {
                paper: '#FFFFFF',
                default: '#FFFFFF',
            },
        },
        typography: {
            fontFamily: "'Lato', sans-serif",
            fontSize: 16,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 700,
            fontWeightBold: 900,
            h6: {
                color: Constants.COLORS.HEADER_COLOR,
            },
            h5: {
                color: Constants.COLORS.HEADER_COLOR,
            },
            h4: {
                color: Constants.COLORS.HEADER_COLOR,
            },
            h3: {
                color: Constants.COLORS.HEADER_COLOR,
            },
            h2: {
                color: Constants.COLORS.HEADER_COLOR,
            },
            h1: {
                color: Constants.COLORS.HEADER_COLOR,
            },
        },
    })
);

ReactDOM.render(
    <Provider store={store}>
        <OidcProvider store={store} userManager={UserManager}>
            <ThemeProvider theme={theme}>
                <StylesProvider jss={jss} generateClassName={generateClassName}>
                    <SnackbarProviderWrapper>
                        <ConnectedRouter history={history}>
                            <App />
                        </ConnectedRouter>
                    </SnackbarProviderWrapper>
                </StylesProvider>
            </ThemeProvider>
        </OidcProvider>
    </Provider>,
    document.getElementById('app')
);
