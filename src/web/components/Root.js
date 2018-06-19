// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { hot } from 'react-hot-loader';

import Routes from 'src/routes';

class Root extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <PersistGate loading={null} persistor={persistStore(this.props.store)}>
          <ConnectedRouter history={this.props.history}>
            <Routes />
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default hot(module)(Root);
