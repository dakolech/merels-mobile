import { createStore, applyMiddleware, compose } from 'redux';
import devTools from 'remote-redux-devtools';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import merger from 'redux-storage-merger-immutablejs';
import filter from 'redux-storage-decorator-filter';
import { combineReducers } from 'redux-immutable';
import createSagaMiddleware from 'redux-saga';
import { drawerReducer, cardStackReducer } from './navigation';

const reducer = storage.reducer(combineReducers({
  drawer: drawerReducer,
  cardNavigation: cardStackReducer,
}), merger);

export const engine = filter(createEngine('my-save-key'),
  // whitelist
  [],
  // blacklist
  ['drawer', 'cardNavigation'],
);

const middleware = storage.createMiddleware(engine, []);

export const sagaMiddleware = createSagaMiddleware();

const createStoreWithMiddleware = compose(
  applyMiddleware(sagaMiddleware),
  applyMiddleware(middleware),
  devTools({
    name: 'Merels', realtime: true,
  }),
)(createStore);

/**
 * ## configureStore
 * @param {Object} the state with for keys:
 * device, global, auth, profile
 *
 */
export function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
