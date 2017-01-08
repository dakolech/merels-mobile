
import { fromJS, Map } from 'immutable';
import type { Action } from '../action.types';
import { OPEN_DRAWER, CLOSE_DRAWER } from './drawer.actions';

export const initialStateDrawer = fromJS({
  drawerState: 'closed',
  drawerDisabled: true,
});

export function drawerReducer(state: Map = initialStateDrawer, action: Action): Map {
  if (action.type === OPEN_DRAWER) {
    return state.set('drawerState', 'opened');
  }

  if (action.type === CLOSE_DRAWER) {
    return state.set('drawerState', 'closed');
  }

  return state;
}
