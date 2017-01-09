export const NEXT_MOVE = 'NEXT_MOVE';
export const SET_PAWN = 'SET_PAWN';
export const NEXT_PLAYER = 'NEXT_PLAYER';
export const REMOVE_PAWN_FROM_HAND = 'REMOVE_PAWN_FROM_HAND';
export const REMOVE_PAWN_FROM_BOARD = 'REMOVE_PAWN_FROM_BOARD';

function newAction(type) {
  return payload => ({ payload, type });
}

// row: number
// column: number
export const setPawn = newAction(SET_PAWN);


export const nextPlayer = newAction(NEXT_PLAYER);

// row: number
// column: number
export const nextMove = newAction(NEXT_MOVE);

// player: PLAYER1|PLAYER2
export const removePawnFromHand = newAction(REMOVE_PAWN_FROM_HAND);
export const removePawnFromBoard = newAction(REMOVE_PAWN_FROM_BOARD);
