import { Map, fromJS } from 'immutable';
import { board, playerPawns } from './board.generator';
import { SET_PAWN, NEXT_PLAYER } from './game.actions';

export const PLAYER1 = 'PLAYER1';
export const PLAYER2 = 'PLAYER2';

export const initialStateGame = fromJS({
  board,
  [PLAYER1]: {
    pawns: playerPawns,
    color: '#000',
  },
  [PLAYER2]: {
    pawns: playerPawns,
    color: '#0F0',
  },
  currentPlayer: PLAYER1,
});

// board: [[{
//   isPawnBox: boolean,
//   N: boolean,
//   S: boolean,
//   W: boolean,
//   E: boolean,
//   pawn: PLAYER1|PLAYER2,
// }]]

export function gameReducer(state: Map = initialStateGame, action): Map {
  const actions = {
    [SET_PAWN]: () =>
      state.setIn(['board', action.payload.row, action.payload.column, 'pawn'], state.get('currentPlayer')),
    [NEXT_PLAYER]: () => state.update('currentPlayer', currentPlayer => currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1),
  };
  const stateChangingFn: () => Map = actions[action.type];
  return !!stateChangingFn ? stateChangingFn() : state;
}
