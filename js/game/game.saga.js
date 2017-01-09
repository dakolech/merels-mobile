import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE, setPawn, nextPlayer, removePawnFromHand } from './game.actions';

function* nextMove({ payload: { row, column } }) {
  const state = yield select();
  const player = state.getIn(['game', 'currentPlayer']);
  const pawnInHand = state.getIn(['game', player, 'pawnsInHand']);
  if (pawnInHand > 0) {
    yield put(setPawn({ row, column }));
    yield put(removePawnFromHand({ player }));
  }
  yield put(nextPlayer());
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}
