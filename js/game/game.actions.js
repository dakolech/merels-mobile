export const NEXT_MOVE = 'NEXT_MOVE';
export const SET_PAWN = 'SET_PAWN';
export const NEXT_PLAYER = 'NEXT_PLAYER';

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
