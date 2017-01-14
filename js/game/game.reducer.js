import { Map, fromJS } from 'immutable';
import { Dimensions } from 'react-native';
import { board, playerPawns, boardToDraw } from './board.generator';
import { SET_PAWN, NEXT_PLAYER, REMOVE_PAWN_FROM_HAND, REMOVE_PAWN_FROM_BOARD } from './game.actions';
import { padding } from './components/board.styles';

export const PLAYER1 = 'PLAYER1';
export const PLAYER2 = 'PLAYER2';

const boxSize = Math.floor(((Dimensions.get('window').width - (padding * 2)) / boardToDraw.size));

export const initialStateGame = fromJS({
  board,
  boardToDraw,
  [PLAYER1]: {
    pawnsInHand: playerPawns,
    pawnsOnBoard: 0,
    color: '#000',
  },
  [PLAYER2]: {
    pawnsInHand: playerPawns,
    pawnsOnBoard: 0,
    color: '#0F0',
  },
  currentPlayer: PLAYER1,
  boxSize,
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
    [REMOVE_PAWN_FROM_HAND]: () => state
      .updateIn([action.payload.player, 'pawnsInHand'], pawnsInHand => pawnsInHand - 1)
      .updateIn([action.payload.player, 'pawnsOnBoard'], pawnsOnBoard => pawnsOnBoard + 1),
  };
  const stateChangingFn: () => Map = actions[action.type];
  return !!stateChangingFn ? stateChangingFn() : state;
}
