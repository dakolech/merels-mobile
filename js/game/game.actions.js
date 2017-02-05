import { PLAYER1, PLAYER2, PUT_ACTION, TAKE_ACTION } from './game.reducer';

type setPawnType = {
  row: number,
  column: number,
}

type playerType = {
  player: PLAYER1|PLAYER2,
}

type playerPawnType = {
  row: number,
  column: number,
  player: PLAYER1|PLAYER2,
}

type actionType = {
  type: PUT_ACTION|TAKE_ACTION,
}

type nextMoveType = {
  text: string,
}

type Action =
  { type: 'SET_PAWN', payload: setPawnType }
    | { type: 'NEXT_MOVE', payload: setPawnType }
    | { type: 'NEXT_PLAYER' }
    | { type: 'REMOVE_PAWN_FROM_HAND', payload: playerPawnType }
    | { type: 'REMOVE_PAWN_FROM_BOARD', payload: playerType }
    | { type: 'SET_NEXT_MOVE_TEXT', payload: nextMoveType }

export const SET_PAWN = 'SET_PAWN';
export const NEXT_MOVE = 'NEXT_MOVE';
export const NEXT_PLAYER = 'NEXT_PLAYER';
export const REMOVE_PAWN_FROM_HAND = 'REMOVE_PAWN_FROM_HAND';
export const REMOVE_PAWN_FROM_BOARD = 'REMOVE_PAWN_FROM_BOARD';
export const SET_NEXT_MOVE_TEXT = 'SET_NEXT_MOVE_TEXT';
export const SET_MILL_IN_BOX = 'SET_MILL_IN_BOX';
export const REMOVE_MILL_IN_BOX = 'REMOVE_MILL_IN_BOX';
export const CHANGE_ACTION_TYPE = 'CHANGE_ACTION_TYPE';
export const HIGHLIGHT_AVAILABLE_PAWN = 'HIGHLIGHT_AVAILABLE_PAWN';
export const HIGHLIGHT_AVAILABLE_BOX = 'HIGHLIGHT_AVAILABLE_BOX';
export const HIGHLIGHT_ALL_AVAILABLE_BOXES = 'HIGHLIGHT_ALL_AVAILABLE_BOXES';
export const CACHE_PAWN_POSITION = 'CACHE_PAWN_POSITION';
export const CLEAN_HIGHLIGHTED_PAWNS = 'CLEAN_HIGHLIGHTED_PAWNS';

function newAction(type) {
  return (payload): Action => ({ payload, type });
}

export const nextPlayer: () => Action = newAction(NEXT_PLAYER);
export const setPawn: (payload: setPawnType) => Action = newAction(SET_PAWN);
export const nextMove: (payload: setPawnType) => Action = newAction(NEXT_MOVE);
export const removePawnFromHand: (payload: playerType) => Action = newAction(REMOVE_PAWN_FROM_HAND);
export const removePawnFromBoard: (payload: playerPawnType) => Action = newAction(REMOVE_PAWN_FROM_BOARD);
export const setNextMoveText: (payload: nextMoveType) => Action = newAction(SET_NEXT_MOVE_TEXT);
export const setMillInBox: (payload: setPawnType) => Action = newAction(SET_MILL_IN_BOX);
export const removeMillInBox: (payload: setPawnType) => Action = newAction(REMOVE_MILL_IN_BOX);
export const changeActionType: (payload: actionType) => Action = newAction(CHANGE_ACTION_TYPE);
export const highlightAvailablePawns: (payload: playerType) => Action = newAction(HIGHLIGHT_AVAILABLE_PAWN);
export const highlightAvailableBox: (payload: setPawnType) => Action = newAction(HIGHLIGHT_AVAILABLE_BOX);
export const highlightAllAvailableBoxes: () => Action = newAction(HIGHLIGHT_ALL_AVAILABLE_BOXES);
export const cachePawnPosition: (payload: setPawnType) => Action = newAction(CACHE_PAWN_POSITION);
export const cleanHighlightedPawns: () => Action = newAction(CLEAN_HIGHLIGHTED_PAWNS);
