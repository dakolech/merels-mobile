
import { Map, fromJS } from 'immutable';
import { board } from './board.generator';

export const initialStateGame = fromJS({
  board,
});

export function gameReducer(state: Map = initialStateGame, action): Map {
  const actions = {
  };
  const stateChangingFn: () => Map = actions[action.type];
  return !!stateChangingFn ? stateChangingFn() : state;
}
