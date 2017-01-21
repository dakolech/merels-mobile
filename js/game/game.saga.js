import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE, setPawn, nextPlayer, removePawnFromHand, setNextMoveText } from './game.actions';
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

function countPawnsInLine(board, player, selectedBox, direction, counter = 0) {
  let newCounter = counter;
  if (selectedBox.get('pawn') === player) {
    newCounter += 1;
  }
  if (!selectedBox.get(direction)) {
    return newCounter;
  }

  return countPawnsInLine(board, player, getNextBox(board, selectedBox, direction), direction, newCounter);
}

function isMill(board, row, column, player, millSize) {
  const selectedBox = board.getIn([column, row]);

  const northLine = countPawnsInLine(board, player, selectedBox, 'N');
  const southLine = countPawnsInLine(board, player, selectedBox, 'S');
  const eastLine = countPawnsInLine(board, player, selectedBox, 'E');
  const westLine = countPawnsInLine(board, player, selectedBox, 'W');
  return (northLine + southLine + eastLine + westLine) >= (millSize - 1);
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
    if (pawnsInHand <= 7 && isMill(board, row, column, player, millSize)) {
      console.log('take one');
      yield put(setNextMoveText({ text: removePawn(playerName) }));
    }
    yield put(setNextMoveText({ text: putPawn(opponentName) }));
  }
  yield put(nextPlayer());
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}
