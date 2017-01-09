
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import * as storage from 'redux-storage';
import { fork } from 'redux-saga/effects';
import App from './App';
import { configureStore, engine, sagaMiddleware } from './configureStore';
import { initialStateDrawer as drawer,
    initialStateCardNavigation as cardNavigation, sideBarNavSaga } from './navigation';
import { initialStateGame as game, gameSaga } from './game';

const initialState = fromJS({
  drawer,
  cardNavigation,
  game,
});

function* rootSaga() {
  yield [
    fork(sideBarNavSaga),
    fork(gameSaga),
  ];
}

function setup(): React.Component {
  class Root extends Component {

    constructor() {
      super();
      const store = configureStore(initialState);
      sagaMiddleware.run(rootSaga);
      const load = storage.createLoader(engine);

      load(store);

      this.state = {
        isLoading: false,
        store,
      };
    }

    render() {
      return (
        <Provider store={this.state.store}>
          <App />
        </Provider>
      );
    }
  }

  return Root;
}

export default setup;
