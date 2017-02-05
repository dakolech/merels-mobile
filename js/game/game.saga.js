import { fromJS } from 'immutable';
import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE, setPawn, nextPlayer, removePawnFromHand, setNextMoveText, setMillInBox,
    changeActionType, highlightAvailablePawns, removePawnFromBoard, cleanHighlightedPawns,
    cachePawnPosition, highlightAvailableBox, removeMillInBox, highlightAllAvailableBoxes,
    setWinner } from './game.actions';
import { putPawnMessage, removePawnMessage, selectPawnMessage, movePawnMessage, setWinnerMessage } from './game.messages';
import { PLAYER1, PLAYER2, PUT_ACTION, TAKE_ACTION, MOVE_ACTION, SELECT_TO_MOVE,
    TAKE_AFTER_MOVE_ACTION, SELECT_TO_JUMP, END_GAME } from './game.reducer';

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

function findMill(board, selectedBox, player, cachedPawn) {
  const newBoard = cachedPawn ?
    board.setIn([cachedPawn.get('column'), cachedPawn.get('row'), 'pawn'], undefined)
    : board;
  return fromJS({
    N: countPawnsInLine(newBoard, player, selectedBox, 'N'),
    S: countPawnsInLine(newBoard, player, selectedBox, 'S'),
    E: countPawnsInLine(newBoard, player, selectedBox, 'E'),
    W: countPawnsInLine(newBoard, player, selectedBox, 'W'),
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
        curr.get('pawn') === player && curr.get('isInMill') === 0 ? acc + 1 : acc
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

function findExistedMill(board, selectedBox, direction, acc = fromJS([])) {
  const newBox = getNextBox(board, selectedBox, direction);
  let newAcc = acc;
  if (!newBox || !selectedBox.get(direction)) {
    return newAcc;
  }
  if (newBox.get('isInMill') > 0) {
    newAcc = acc.push(fromJS({
      column: newBox.get('column'),
      row: newBox.get('row'),
    }));
  }

  return findExistedMill(board, newBox, direction, newAcc);
}

function removeMillOnTheBoard(board, selectedBox) {
  return fromJS([
    findExistedMill(board, selectedBox, 'N'),
    findExistedMill(board, selectedBox, 'S'),
    findExistedMill(board, selectedBox, 'E'),
    findExistedMill(board, selectedBox, 'W'),
  ])
  .flatten(1)
  .map(item => put(removeMillInBox({ column: item.get('column'), row: item.get('row') }))).toJS();
}

function* findMillOnTheBoard(board, selectedBox, player, millSize, cachedPawn) {
  const millObject = findMill(board, selectedBox, player, cachedPawn);
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
  const pawnsOnBoard = state.getIn(['game', player, 'pawnsOnBoard']);
  const opponentPawnsOnBoard = state.getIn(['game', opponent, 'pawnsOnBoard']);
  const opponentName = state.getIn(['game', opponent, 'name']);
  const playerName = state.getIn(['game', player, 'name']);
  const board = state.getIn(['game', 'board']);
  const millSize = state.getIn(['game', 'millSize']);
  const currentAction = state.getIn(['game', 'currentAction']);
  const selectedBox = board.getIn([column, row]);
  const cachedPawn = state.getIn(['game', 'cacheSelectedPawn']);
  const moveOrJump = pawns => pawns === 3 ? SELECT_TO_JUMP : SELECT_TO_MOVE;

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
      if (opponentPawnsInHand === 0 && pawnsInHand === 1 && !isMill) {
        yield put(changeActionType({ type: SELECT_TO_MOVE }));
        yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
      }
    } else {
      yield put(nextPlayer());
    }
  }

  if (currentAction === TAKE_ACTION &&
    selectedBox.get('pawn') &&
    selectedBox.get('isHighlighted') &&
    selectedBox.get('isInMill') === 0
  ) {
    yield put(removePawnFromBoard({ row, column, player: opponent }));
    if (opponentPawnsInHand === 0 && pawnsInHand === 0) {
      yield put(changeActionType({ type: SELECT_TO_MOVE }));
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
    } else {
      yield put(setNextMoveText({ text: putPawnMessage(opponentName) }));
      yield put(changeActionType({ type: PUT_ACTION }));
    }
    yield put(cleanHighlightedPawns());
    yield put(nextPlayer());

    if (opponentPawnsInHand === 0 && pawnsInHand === 1 && currentAction !== TAKE_ACTION) {
      yield put(changeActionType({ type: moveOrJump(opponentPawnsOnBoard) }));
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
    }
  }

  if ((currentAction === SELECT_TO_MOVE || currentAction === SELECT_TO_JUMP) && selectedBox.get('pawn') === player) {
    let availableBoxes = { length: 1 };
    if (pawnsOnBoard === 3) {
      yield put(highlightAllAvailableBoxes());
    } else {
      availableBoxes = yield findAvailableBoxes(board, selectedBox);
    }
    if (availableBoxes.length > 0) {
      yield put(cachePawnPosition({ row, column }));
      yield put(changeActionType({ type: MOVE_ACTION }));
      yield put(setNextMoveText({ text: movePawnMessage(playerName) }));
    }
  }

  if (currentAction === MOVE_ACTION && selectedBox.get('pawn') === player) {
    yield put(cleanHighlightedPawns());
    if (pawnsOnBoard === 3) {
      yield put(highlightAllAvailableBoxes());
    } else {
      yield findAvailableBoxes(board, selectedBox);
    }
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
    const isMill = yield findMillOnTheBoard(board, selectedBox, player, millSize, cachedPawn);

    if (isMill) {
      yield handleTakeMove(board, opponent, column, row, playerName, TAKE_AFTER_MOVE_ACTION);
    } else {
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
      yield put(changeActionType({ type: moveOrJump(opponentPawnsOnBoard) }));
      yield put(nextPlayer());
    }
  }

  if (currentAction === TAKE_AFTER_MOVE_ACTION &&
    selectedBox.get('pawn') &&
    selectedBox.get('isHighlighted') &&
    selectedBox.get('isInMill') === 0
  ) {
    yield put(removePawnFromBoard({ row, column, player: opponent }));
    if (opponentPawnsOnBoard === 3) {
      yield put(setWinner({ player }));
      yield put(setNextMoveText({ text: setWinnerMessage(playerName) }));
      yield put(cleanHighlightedPawns());
      yield put(changeActionType({ type: END_GAME }));
    } else {
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
      yield put(changeActionType({ type: moveOrJump(opponentPawnsOnBoard) }));
      yield put(cleanHighlightedPawns());
      yield put(nextPlayer());
    }
  }
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}
