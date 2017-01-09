import { put, takeEvery } from 'redux-saga/effects';
import { NEXT_MOVE, setPawn, nextPlayer } from './game.actions';

function* nextMove({ payload: { row, column } }) {
  yield put(setPawn({ row, column }));
  yield put(nextPlayer());
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}
