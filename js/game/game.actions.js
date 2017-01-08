export const SET_PAWN = 'SET_PAWN';


function newAction(type) {
  return payload => ({ payload, type });
}

export const setPawn = newAction(SET_PAWN);
