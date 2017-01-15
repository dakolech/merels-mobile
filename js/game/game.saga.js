import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE, setPawn, nextPlayer, removePawnFromHand, setNextMoveText } from './game.actions';
import { putPawn } from './game.messages';
import { PLAYER1, PLAYER2 } from './game.reducer';

function* nextMove({ payload: { row, column } }) {
  const state = yield select();
  const player = state.getIn(['game', 'currentPlayer']);
  const pawnInHand = state.getIn(['game', player, 'pawnsInHand']);
  const opponentName = state.getIn(['game', player === PLAYER1 ? PLAYER2 : PLAYER1, 'name']);
  if (pawnInHand > 0) {
    yield put(setPawn({ row, column }));
    yield put(removePawnFromHand({ player }));
    yield put(setNextMoveText({ text: putPawn(opponentName) }));
  }
  yield put(nextPlayer());
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}
