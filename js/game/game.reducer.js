import { Map, fromJS } from 'immutable';
import { board } from './board.generator';
import { SET_PAWN } from './game.actions';

export const initialStateGame = fromJS({
  board,
});

export function gameReducer(state: Map = initialStateGame, action): Map {
  const actions = {
    [SET_PAWN]: () => state.updateIn(['board', action.payload.row, action.payload.column],
      item => item.set('pawn', action.payload.pawn)),
  };
  const stateChangingFn: () => Map = actions[action.type];
  return !!stateChangingFn ? stateChangingFn() : state;
}
