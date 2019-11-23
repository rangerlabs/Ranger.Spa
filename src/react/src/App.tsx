import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { Route } from 'react-router';
import Routes from './components/Routes';

const App = () => {
    return <Route path="*" render={props => <Routes {...props} />} />;
};
export default App;
