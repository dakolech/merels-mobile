import { PLAYER1, PLAYER2 } from './game.reducer';

type setPawnType = {
  row: number,
  column: number,
}

type playerType = {
  player: PLAYER1|PLAYER2,
}

type nextMoveType = {
  text: string,
}

type Action =
  { type: 'SET_PAWN', payload: setPawnType }
    | { type: 'NEXT_MOVE', payload: setPawnType }
    | { type: 'NEXT_PLAYER' }
    | { type: 'REMOVE_PAWN_FROM_HAND', payload: playerType }
    | { type: 'REMOVE_PAWN_FROM_BOARD', payload: playerType }
    | { type: 'SET_NEXT_MOVE_TEXT', payload: nextMoveType }

export const SET_PAWN = 'SET_PAWN';
export const NEXT_MOVE = 'NEXT_MOVE';
export const NEXT_PLAYER = 'NEXT_PLAYER';
export const REMOVE_PAWN_FROM_HAND = 'REMOVE_PAWN_FROM_HAND';
export const REMOVE_PAWN_FROM_BOARD = 'REMOVE_PAWN_FROM_BOARD';
export const SET_NEXT_MOVE_TEXT = 'SET_NEXT_MOVE_TEXT';
export const SET_MILL_IN_BOX = 'SET_MILL_IN_BOX';

function newAction(type) {
  return (payload): Action => ({ payload, type });
}

export const nextPlayer: () => Action = newAction(NEXT_PLAYER);
export const setPawn: (payload: setPawnType) => Action = newAction(SET_PAWN);
export const nextMove: (payload: setPawnType) => Action = newAction(NEXT_MOVE);
export const removePawnFromHand: (payload: playerType) => Action = newAction(REMOVE_PAWN_FROM_HAND);
export const removePawnFromBoard: (payload: playerType) => Action = newAction(REMOVE_PAWN_FROM_BOARD);
export const setNextMoveText: (payload: nextMoveType) => Action = newAction(SET_NEXT_MOVE_TEXT);
export const setMillInBox: (payload: setPawnType) => Action = newAction(SET_MILL_IN_BOX);
