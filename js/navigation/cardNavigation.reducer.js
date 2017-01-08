import { fromJS, Map } from 'immutable';
import { NavigationExperimental } from 'react-native';
import type { Action } from '../action.types';

import {
  PUSH_ROUTE,
  POP_ROUTE,
  RESET_ROUTE,
  REPLACE_AT,
  REPLACE_AT_INDEX,
  JUMP_TO,
  JUMP_TO_INDEX,
  BACK,
  FORWARD,
} from './navigation.actions';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

function isActionPotentiallyApplicable(action, navigationKey) {
  return action && action.payload && (action.payload.key === navigationKey);
}

export const initialStateCardNavigation = fromJS({
  key: 'global',
  index: 0,
  routes: [
    {
      key: 'mainMenu',
      index: 0,
    },
  ],
});

export function cardStackReducer(state: Map = initialStateCardNavigation, action: Action): Map {
  if (!isActionPotentiallyApplicable(action, state.get('key'))) {
    return state;
  }

  const switchCase = {
    [PUSH_ROUTE]() {
      const newState = NavigationStateUtils.push(state.toJS(), action.payload.route);
      return state.set('index', newState.index).set('routes', fromJS(newState.routes));
    },
    [POP_ROUTE]() {
      const newState = NavigationStateUtils.pop(state.toJS());
      return state.set('index', newState.index).set('routes', fromJS(newState.routes));
    },
    [RESET_ROUTE]() {
      const newState = NavigationStateUtils.reset(state.toJS(), action.payload.routes, action.payload.index);
      return state.set('index', newState.index).set('routes', fromJS(newState.routes));
    },
    [REPLACE_AT]() {
      const newState = NavigationStateUtils.replaceAt(state.toJS(), action.payload.routeKey, action.payload.route);
      return state.set('index', newState.index).set('routes', fromJS(newState.routes));
    },
    [REPLACE_AT_INDEX]() {
      const newState = NavigationStateUtils.replaceAtIndex(state.toJS(), action.payload.index, action.payload.route);
      return state.set('index', newState.index).set('routes', fromJS(newState.routes));
    },
    [JUMP_TO]() {
      const newState = NavigationStateUtils.jumpTo(state.toJS(), action.payload.routeKey);
      return state.set('index', newState.index);
    },
    [JUMP_TO_INDEX]() {
      const newState = NavigationStateUtils.jumpToIndex(state.toJS(), action.payload.routeIndex);
      return state.set('index', newState.index);
    },
    [BACK]() {
      const newState = NavigationStateUtils.back(state.toJS());
      return state.set('index', newState.index);
    },
    [FORWARD]() {
      const newState = NavigationStateUtils.forward(state.toJS());
      return state.set('index', newState.index);
    },
    default: () => state,
  };

  return (switchCase[action.type] || switchCase.default)();
}
