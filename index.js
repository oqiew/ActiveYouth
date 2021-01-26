import React, { Component } from 'react'

import { AppRegistry } from 'react-native';
// import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import App from './src/App';
class ReduxApp extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }

}
AppRegistry.registerComponent(appName, () => ReduxApp);

