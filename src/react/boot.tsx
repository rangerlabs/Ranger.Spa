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

InitializeDatadogLogging();
InitializeGoogleAnalyticsInProduction();
InitializeFullStoryInProduction();

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

function InitializeFullStoryInProduction() {
    if (window.location.host.includes('rangerlabs.io')) {
        const fullStoryScript = document.createElement('script');
        fullStoryScript.append(`
            window['_fs_debug'] = false;
            window['_fs_host'] = 'fullstory.com';
            window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
            window['_fs_org'] = 'V5CAF';
            window['_fs_namespace'] = 'FS';
            (function(m,n,e,t,l,o,g,y){
                if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
                y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                g.anonymize=function(){g.identify(!!0)};
                g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                g.log = function(a,b){g("log",[a,b])};
                g.consent=function(a){g("consent",!arguments.length||a)};
                g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                g.clearUserCookie=function(){};
                g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
                if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
                g._v="1.2.0";
            })(window,document,window['_fs_namespace'],'script','user');
        `);
        document.body.appendChild(fullStoryScript);
    }
}
