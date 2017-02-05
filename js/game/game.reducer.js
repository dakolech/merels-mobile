import { Map, fromJS } from 'immutable';
import { Dimensions } from 'react-native';
import { board, playerPawns, boardToDraw, millSize } from './board.generator';
import { SET_PAWN, NEXT_PLAYER, REMOVE_PAWN_FROM_HAND, REMOVE_PAWN_FROM_BOARD,
    SET_NEXT_MOVE_TEXT, SET_MILL_IN_BOX, CHANGE_ACTION_TYPE, HIGHLIGHT_AVAILABLE_PAWN,
    CLEAN_HIGHLIGHTED_PAWNS, HIGHLIGHT_AVAILABLE_BOX, CACHE_PAWN_POSITION, REMOVE_MILL_IN_BOX } from './game.actions';
import { padding } from './components/board.styles';
import { putPawnMessage } from './game.messages';

export const PLAYER1 = 'PLAYER1';
export const PLAYER2 = 'PLAYER2';
export const PUT_ACTION = 'PUT_ACTION';
export const TAKE_ACTION = 'TAKE_ACTION';
export const SELECT_TO_MOVE = 'SELECT_TO_MOVE';
export const MOVE_ACTION = 'MOVE_ACTION';
export const TAKE_AFTER_MOVE_ACTION = 'TAKE_AFTER_MOVE_ACTION';

const boxSize = Math.floor(((Dimensions.get('window').width - (padding * 2)) / boardToDraw.size));

export const initialStateGame = fromJS({
  board,
  boardToDraw,
  [PLAYER1]: {
    pawnsInHand: playerPawns,
    pawnsOnBoard: 0,
    color: '#000',
    name: 'Player 1',
  },
  [PLAYER2]: {
    pawnsInHand: playerPawns,
    pawnsOnBoard: 0,
    color: '#0F0',
    name: 'Player 2',
  },
  currentPlayer: PLAYER1,
  currentAction: PUT_ACTION,
  boxSize,
  nextMove: putPawnMessage('Player 1'),
  millSize,
  cacheSelectedPawn: {
    column: undefined,
    row: undefined,
  },
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
      state.setIn(['board', action.payload.column, action.payload.row, 'pawn'], state.get('currentPlayer')),
    [NEXT_PLAYER]: () => state.update('currentPlayer', currentPlayer => currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1),
    [REMOVE_PAWN_FROM_HAND]: () => state
      .updateIn([action.payload.player, 'pawnsInHand'], pawnsInHand => pawnsInHand - 1)
      .updateIn([action.payload.player, 'pawnsOnBoard'], pawnsOnBoard => pawnsOnBoard + 1),
    [REMOVE_PAWN_FROM_BOARD]: () =>
      state.setIn(['board', action.payload.column, action.payload.row, 'pawn'], undefined),
    [SET_NEXT_MOVE_TEXT]: () => state.set('nextMove', action.payload.text),
    [SET_MILL_IN_BOX]: () =>
      state.updateIn(['board', action.payload.column, action.payload.row, 'isInMill'], v => v + 1),
    [REMOVE_MILL_IN_BOX]: () =>
      state.updateIn(['board', action.payload.column, action.payload.row, 'isInMill'], v => v - 1),
    [CHANGE_ACTION_TYPE]: () => state.set('currentAction', action.payload.type),
    [HIGHLIGHT_AVAILABLE_PAWN]: () =>
      state.update('board', columns =>
        columns.map(row =>
          row.map(box =>
            box.get('isPawnBox') && !box.get('isMill') && box.get('pawn') === action.payload.player ?
              box.set('isHighlighted', true) :
              box,
          ),
        ),
      ),
    [CLEAN_HIGHLIGHTED_PAWNS]: () =>
      state.update('board', columns =>
        columns.map(row =>
          row.map(box => box.set('isHighlighted', false)),
        ),
      ),
    [HIGHLIGHT_AVAILABLE_BOX]: () =>
      state.setIn(['board', action.payload.column, action.payload.row, 'isHighlighted'], true),
    [CACHE_PAWN_POSITION]: () =>
      state
        .setIn(['cacheSelectedPawn', 'column'], action.payload.column)
        .setIn(['cacheSelectedPawn', 'row'], action.payload.row),
  };
  const stateChangingFn: () => Map = actions[action.type];
  return !!stateChangingFn ? stateChangingFn() : state;
}
