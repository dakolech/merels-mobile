import { put, takeEvery, select } from 'redux-saga/effects';
import { replaceAt, popRoute, pushRoute, NAVIGATE_TO } from './navigation.actions';
import { closeDrawer } from './drawer.actions';

function* navigateTo({ payload: { route, homeRoute, isSidebar } }) {
  const state = yield select();
  const navigation = state.cardNavigation.toJS();
  const currentRouteKey = navigation.routes[navigation.routes.length - 1].key;

  if (isSidebar) {
    yield put(closeDrawer());
  }

  if (currentRouteKey !== homeRoute && route !== homeRoute) {
    yield put(replaceAt(currentRouteKey, { key: route, index: 1 }, navigation.key));
  } else if (currentRouteKey !== homeRoute && route === homeRoute) {
    yield put(popRoute(navigation.key));
  } else if (currentRouteKey === homeRoute && route !== homeRoute) {
    yield put(pushRoute({ key: route, index: 1 }, navigation.key));
  }
}

export function* sideBarNavSaga() {
  yield takeEvery(NAVIGATE_TO, navigateTo);
}
