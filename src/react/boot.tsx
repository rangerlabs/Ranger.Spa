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
import SnackbarProviderWrapper from './src/components/notifier/SnackbarProviderWrapper';
import { responsiveFontSizes } from '@material-ui/core';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import { jss, generateClassName } from './src/theme/StylesProviderPropsConfig';
import Constants from './src/theme/Constants';
import Notifier from './src/components/notifier/Notifier';
import { datadogLogs, Datacenter } from '@datadog/browser-logs';
import { getSpaVersion } from './src/helpers/Helpers';
import GlobalConfig from './src/helpers/GlobalConfig';
import ReactGA from 'react-ga';
import ScrollToTop from './src/components/scrollToTop/ScrollToTop';
import * as FullStory from '@fullstory/browser';
import ExtendPrototypes from './src/rxjs/debounceNonDistinct';

ExtendPrototypes();
InitializeDatadogLogging();
InitializeGoogleAnalyticsInProduction();
FullStory.init({ orgId: 'V5CAF' });

const initialState = {} as ApplicationState;
ReduxStore.Configure(history, initialState);
const store = ReduxStore.getStore();

const theme = responsiveFontSizes(
    createRangerTheme({
        palette: {
            type: 'light',
            primary: {
                main: Constants.COLORS.PRIMARY_COLOR,
                contrastText: Constants.COLORS.WHITE,
            },
            secondary: {
                main: Constants.COLORS.WHITE,
                contrastText: Constants.COLORS.WHITE,
            },
            text: {
                primary: Constants.COLORS.BLACK,
            },
            background: {
                default: '#fafafa',
            },
            error: {
                main: '#bc3025',
            },
        },
        typography: {
            fontFamily: "'Lato', sans-serif",
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 700,
            fontWeightBold: 900,
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
                            <ScrollToTop />
                            <App />
                            <Notifier />
                        </ConnectedRouter>
                    </SnackbarProviderWrapper>
                </StylesProvider>
            </ThemeProvider>
        </OidcProvider>
    </Provider>,
    document.getElementById('app')
);
function InitializeDatadogLogging() {
    datadogLogs.init({
        clientToken: 'pube931a53a3562644ba5faf428d65ed896',
        datacenter: Datacenter.US,
        service: 'React',
        forwardErrorsToLogs: true,
        sampleRate: 100,
        version: getSpaVersion(),
        env: GlobalConfig.ENVIRONMENT,
    });
}

function InitializeGoogleAnalyticsInProduction() {
    if (window.location.host.includes('rangerlabs.io')) {
        ReactGA.initialize('UA-170915922-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }
}
