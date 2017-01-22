import { fromJS } from 'immutable';
import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE, setPawn, nextPlayer, removePawnFromHand, setNextMoveText, setMillInBox,
    changeActionType, highlightAvailablePawns, removePawnFromBoard, cleanHighlightedPawns } from './game.actions';
import { putPawn, removePawn } from './game.messages';
import { PLAYER1, PLAYER2, PUT_ACTION, TAKE_ACTION } from './game.reducer';

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

function findMill(board, selectedBox, player) {
  return fromJS({
    N: countPawnsInLine(board, player, selectedBox, 'N'),
    S: countPawnsInLine(board, player, selectedBox, 'S'),
    E: countPawnsInLine(board, player, selectedBox, 'E'),
    W: countPawnsInLine(board, player, selectedBox, 'W'),
  });
}

function isLineMill(millObject, direction1, direction2, millSize) {
  return millObject.getIn([direction1, 'counter']) + millObject.getIn([direction2, 'counter']) >= (millSize - 1);
}

function setMillInBoxes(millObject, direction) {
  return millObject
    .getIn([direction, 'boxes'])
    .map(item => put(setMillInBox({ column: item[0], row: item[1] })))
    .toJS();
}

function countAvailablePawns(board, player) {
  return board
    .reduce((accPar, currPar) =>
      currPar.reduce((acc, curr) =>
        curr.get('pawn') === player ? acc + 1 : acc
      , accPar)
    , 0);
}

function* nextMove({ payload: { row, column } }) {
  const state = yield select();
  const player = state.getIn(['game', 'currentPlayer']);
  const opponent = player === PLAYER1 ? PLAYER2 : PLAYER1;
  const pawnsInHand = state.getIn(['game', player, 'pawnsInHand']);
  const opponentName = state.getIn(['game', opponent, 'name']);
  const playerName = state.getIn(['game', player, 'name']);
  const board = state.getIn(['game', 'board']);
  const millSize = state.getIn(['game', 'millSize']);
  const currentAction = state.getIn(['game', 'currentAction']);
  const selectedBox = board.getIn([column, row]);

  if (pawnsInHand > 0 && currentAction === PUT_ACTION && !selectedBox.get('pawn')) {
    yield put(setPawn({ row, column }));
    yield put(removePawnFromHand({ player }));
    if (pawnsInHand <= 7) {
      const millObject = findMill(board, selectedBox, player);
      const isVerticalMill = isLineMill(millObject, 'N', 'S', millSize);
      const isHorizontalMill = isLineMill(millObject, 'E', 'W', millSize);

      if (isVerticalMill) {
        yield setMillInBoxes(millObject, 'N');
        yield setMillInBoxes(millObject, 'S');
      }

      if (isHorizontalMill) {
        yield setMillInBoxes(millObject, 'E');
        yield setMillInBoxes(millObject, 'W');
      }


      if (isVerticalMill || isHorizontalMill) {
        const availableOpponentPawns = countAvailablePawns(board, opponent);

        if (availableOpponentPawns > 0) {
          yield put(setMillInBox({ column, row }));
          yield put(setNextMoveText({ text: removePawn(playerName) }));
          yield put(changeActionType({ type: TAKE_ACTION }));
          yield put(highlightAvailablePawns({ player: opponent }));
        }
      } else {
        yield put(setNextMoveText({ text: putPawn(opponentName) }));
        yield put(nextPlayer());
      }
    } else {
      yield put(nextPlayer());
    }
  }

  if (currentAction === TAKE_ACTION && selectedBox.get('pawn') && selectedBox.get('isHighlighted')) {
    yield put(removePawnFromBoard({ row, column }));
    yield put(setNextMoveText({ text: putPawn(opponentName) }));
    yield put(changeActionType({ type: PUT_ACTION }));
    yield put(cleanHighlightedPawns());
    yield put(nextPlayer());
  }
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}
