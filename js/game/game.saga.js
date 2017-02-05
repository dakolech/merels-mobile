import { fromJS } from 'immutable';
import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE, setPawn, nextPlayer, removePawnFromHand, setNextMoveText, setMillInBox,
    changeActionType, highlightAvailablePawns, removePawnFromBoard, cleanHighlightedPawns,
    cachePawnPosition, highlightAvailableBox, removeMillInBox } from './game.actions';
import { putPawnMessage, removePawnMessage, selectPawnMessage, movePawnMessage } from './game.messages';
import { PLAYER1, PLAYER2, PUT_ACTION, TAKE_ACTION, MOVE_ACTION, SELECT_TO_MOVE,
    TAKE_AFTER_MOVE_ACTION } from './game.reducer';

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

function findAvailableBox(board, selectedBox, direction) {
  const newBox = getNextBox(board, selectedBox, direction);
  if (!newBox || !selectedBox.get(direction)) {
    return false;
  }
  if (newBox.get('isPawnBox') && !newBox.get('pawn')) {
    return {
      column: newBox.get('column'),
      row: newBox.get('row'),
    };
  }

  if (newBox.get('isPawnBox') && !!newBox.get('pawn')) {
    return false;
  }

  return findAvailableBox(board, newBox, direction);
}

function findAvailableBoxes(board, selectedBox) {
  return [
    findAvailableBox(board, selectedBox, 'N'),
    findAvailableBox(board, selectedBox, 'S'),
    findAvailableBox(board, selectedBox, 'E'),
    findAvailableBox(board, selectedBox, 'W'),
  ]
  .filter(Boolean)
  .map(({ column, row }) => put(highlightAvailableBox({ column, row })));
}

function findExistedMill(board, selectedBox, direction) {
  const newBox = getNextBox(board, selectedBox, direction);
  if (!newBox || !selectedBox.get(direction)) {
    return false;
  }
  if (newBox.get('isInMill') > 0) {
    return {
      column: newBox.get('column'),
      row: newBox.get('row'),
    };
  }

  if (newBox.get('isPawnBox') && !!newBox.get('pawn')) {
    return false;
  }

  return findExistedMill(board, newBox, direction);
}

function removeMillOnTheBoard(board, selectedBox) {
  return [
    findExistedMill(board, selectedBox, 'N'),
    findExistedMill(board, selectedBox, 'S'),
    findExistedMill(board, selectedBox, 'E'),
    findExistedMill(board, selectedBox, 'W'),
  ]
  .filter(Boolean)
  .map(({ column, row }) => put(removeMillInBox({ column, row })));
}

function* findMillOnTheBoard(board, selectedBox, player, millSize) {
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
  return isVerticalMill || isHorizontalMill;
}

function* handleTakeMove(board, opponent, column, row, playerName, action) {
  const availableOpponentPawns = countAvailablePawns(board, opponent);

  if (availableOpponentPawns > 0) {
    yield put(setMillInBox({ column, row }));
    yield put(setNextMoveText({ text: removePawnMessage(playerName) }));
    yield put(changeActionType({ type: action }));
    yield put(highlightAvailablePawns({ player: opponent }));
  }
}

function* nextMove({ payload: { row, column } }) {
  const state = yield select();
  const player = state.getIn(['game', 'currentPlayer']);
  const opponent = player === PLAYER1 ? PLAYER2 : PLAYER1;
  const pawnsInHand = state.getIn(['game', player, 'pawnsInHand']);
  const opponentPawnsInHand = state.getIn(['game', opponent, 'pawnsInHand']);
  const opponentName = state.getIn(['game', opponent, 'name']);
  const playerName = state.getIn(['game', player, 'name']);
  const board = state.getIn(['game', 'board']);
  const millSize = state.getIn(['game', 'millSize']);
  const currentAction = state.getIn(['game', 'currentAction']);
  const selectedBox = board.getIn([column, row]);
  const cachedPawn = state.getIn(['game', 'cacheSelectedPawn']);

  if (pawnsInHand > 0 && currentAction === PUT_ACTION && !selectedBox.get('pawn')) {
    yield put(setPawn({ row, column }));
    yield put(removePawnFromHand({ player }));
    if (pawnsInHand <= 7) {
      const isMill = yield findMillOnTheBoard(board, selectedBox, player, millSize);

      if (isMill) {
        yield handleTakeMove(board, opponent, column, row, playerName, TAKE_ACTION);
      } else {
        yield put(setNextMoveText({ text: putPawnMessage(opponentName) }));
        yield put(nextPlayer());
      }
    } else {
      yield put(nextPlayer());
    }
    if (opponentPawnsInHand === 0 && pawnsInHand === 1 && currentAction !== 'TAKE_ACTION') {
      yield put(changeActionType({ type: SELECT_TO_MOVE }));
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
    }
  }

  if (currentAction === TAKE_ACTION && selectedBox.get('pawn') && selectedBox.get('isHighlighted')) {
    yield put(removePawnFromBoard({ row, column }));
    yield put(setNextMoveText({ text: putPawnMessage(opponentName) }));
    yield put(changeActionType({ type: PUT_ACTION }));
    yield put(cleanHighlightedPawns());
    yield put(nextPlayer());

    if (opponentPawnsInHand === 0 && pawnsInHand === 1 && currentAction !== TAKE_ACTION) {
      yield put(changeActionType({ type: SELECT_TO_MOVE }));
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
    }
  }

  if (currentAction === SELECT_TO_MOVE && selectedBox.get('pawn') === player) {
    const availableBoxes = yield findAvailableBoxes(board, selectedBox);
    if (availableBoxes.length > 0) {
      yield put(cachePawnPosition({ row, column }));
      yield put(changeActionType({ type: MOVE_ACTION }));
      yield put(setNextMoveText({ text: movePawnMessage(playerName) }));
    }
  }

  if (currentAction === MOVE_ACTION && selectedBox.get('pawn') === player) {
    yield put(cleanHighlightedPawns());
    yield findAvailableBoxes(board, selectedBox);
    yield put(cachePawnPosition({ row, column }));
  }

  if (currentAction === MOVE_ACTION && selectedBox.get('isHighlighted')) {
    yield put(removePawnFromBoard({ row: cachedPawn.get('row'), column: cachedPawn.get('column') }));
    yield put(setPawn({ row, column }));
    yield put(cleanHighlightedPawns());

    const cachedPawnBox = board.getIn([cachedPawn.get('column'), cachedPawn.get('row')]);
    if (cachedPawnBox.get('isInMill') > 0) {
      yield put(removeMillInBox({ row: cachedPawnBox.get('row'), column: cachedPawnBox.get('column') }));
      yield removeMillOnTheBoard(board, cachedPawnBox);
    }
    const isMill = yield findMillOnTheBoard(board, selectedBox, player, millSize);

    if (isMill) {
      yield handleTakeMove(board, opponent, column, row, playerName, TAKE_AFTER_MOVE_ACTION);
    } else {
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
      yield put(changeActionType({ type: SELECT_TO_MOVE }));
      yield put(nextPlayer());
    }
  }

  if (currentAction === TAKE_AFTER_MOVE_ACTION && selectedBox.get('pawn') && selectedBox.get('isHighlighted')) {
    yield put(removePawnFromBoard({ row, column }));
    yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
    yield put(changeActionType({ type: SELECT_TO_MOVE }));
    yield put(cleanHighlightedPawns());
    yield put(nextPlayer());
  }
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}
