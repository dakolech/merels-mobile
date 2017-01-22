import { fromJS } from 'immutable';
import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE, setPawn, nextPlayer, removePawnFromHand, setNextMoveText, setMillInBox } from './game.actions';
import { putPawn, removePawn } from './game.messages';
import { PLAYER1, PLAYER2 } from './game.reducer';

function getNextBox(board, currentBox, direction) {
  const tempBox = {
    N: () => board.getIn([currentBox.get('column'), currentBox.get('row') - 1]),
    S: () => board.getIn([currentBox.get('column'), currentBox.get('row') + 1]),
    E: () => board.getIn([currentBox.get('column') + 1, currentBox.get('row')]),
    W: () => board.getIn([currentBox.get('column') - 1, currentBox.get('row')]),
  };
  return tempBox[direction]();
}

function countPawnsInLine(board, player, selectedBox, direction, acc = fromJS({ counter: 0, boxes: [] })) {
  let newAcc = acc;
  if (selectedBox.get('pawn') === player) {
    newAcc = newAcc
      .update('counter', i => i + 1)
      .update('boxes', i => i.push([selectedBox.get('column'), selectedBox.get('row')]));
  }
  if (!selectedBox.get(direction)) {
    return newAcc;
  }

  return countPawnsInLine(board, player, getNextBox(board, selectedBox, direction), direction, newAcc);
}

function findMill(board, row, column, player) {
  const selectedBox = board.getIn([column, row]);

  return fromJS({
    N: countPawnsInLine(board, player, selectedBox, 'N'),
    S: countPawnsInLine(board, player, selectedBox, 'S'),
    E: countPawnsInLine(board, player, selectedBox, 'E'),
    W: countPawnsInLine(board, player, selectedBox, 'W'),
  });
  // return (northLine + southLine + eastLine + westLine) >= (millSize - 1);
}

function isLineMill(millObject, direction1, direction2, millSize) {
  return millObject.getIn([direction1, 'counter']) + millObject.getIn([direction2, 'counter']) >= (millSize - 1);
}

function setMillInBoxes(millObject, direction) {
  return millObject.getIn([direction, 'boxes']).map(item => put(setMillInBox({ column: item[0], row: item[1] }))).toJS();
}

function* nextMove({ payload: { row, column } }) {
  const state = yield select();
  const player = state.getIn(['game', 'currentPlayer']);
  const pawnsInHand = state.getIn(['game', player, 'pawnsInHand']);
  const opponentName = state.getIn(['game', player === PLAYER1 ? PLAYER2 : PLAYER1, 'name']);
  const playerName = state.getIn(['game', player === PLAYER2 ? PLAYER2 : PLAYER1, 'name']);
  const board = state.getIn(['game', 'board']);
  const millSize = state.getIn(['game', 'millSize']);
  if (pawnsInHand > 0) {
    yield put(setPawn({ row, column }));
    yield put(removePawnFromHand({ player }));
    if (pawnsInHand <= 7) {
      const millObject = findMill(board, row, column, player);

      if (isLineMill(millObject, 'N', 'S', millSize)) {
        yield setMillInBoxes(millObject, 'N');
        yield setMillInBoxes(millObject, 'S');
        yield put(setMillInBox({ column, row }));
        yield put(setNextMoveText({ text: removePawn(playerName) }));
      }

      if (isLineMill(millObject, 'E', 'W', millSize)) {
        yield setMillInBoxes(millObject, 'E');
        yield setMillInBoxes(millObject, 'W');
        yield put(setMillInBox({ column, row }));
        yield put(setNextMoveText({ text: removePawn(playerName) }));
      }
    }
    yield put(setNextMoveText({ text: putPawn(opponentName) }));
  }
  yield put(nextPlayer());
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}
