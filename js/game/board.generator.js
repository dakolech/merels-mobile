import { fromJS } from 'immutable';

const pawnBox = '*';
const horizontalConnection = '-';
const verticalConnection = '|';
const newLine = '!';

const nineMerelsBoard = `
*-----*-----*!
|     |     |!
| *---*---* |!
| |   |   | |!
| | *-*-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
`;

const nineMerelsBoardMini = `
*--*--*!
|*-*-*|!
||***||!
*** ***!
||***||!
|*-*-*|!
*--*--*!
`;

function optimize(boardString) {
  const board = boardString.replace(/(\r\n|\n|\r)/gm, '').split(newLine).filter(Boolean);
  const neutralValues = [horizontalConnection, verticalConnection, ' '];
  const rowsToSlice = board
    .map((val, index) =>
      val
        .split('')
        .every(item => neutralValues
        .includes(item)) ?
          index :
          false,
    )
    .filter(Boolean);

  const numberArray = Array.from({ length: board[0].length }, (_, i) => i);

  const columnsToSlice = numberArray
    .map(index =>
      board
        .map(item => item[index])
        .every(item => neutralValues
        .includes(item)) ?
          index :
          false,
    )
    .filter(Boolean);

  return board
    .filter((val, index) => !rowsToSlice.includes(index))
    .map(val => val
      .split('')
      .filter((_, index) => !columnsToSlice.includes(index))
      .join(''),
    );
}

function generateBoard(boardString) {
  const splittedBoard = boardString.replace(/(\r\n|\n|\r)/gm, '').split(newLine).filter(Boolean);
  const horizontalSize = splittedBoard.length;
  const verticalSize = splittedBoard[0].length;
  let generatedBoard = fromJS(Array.from({ length: verticalSize }, () => Array.from({ length: horizontalSize })));

  for (let vertIndex = 0; vertIndex < verticalSize; vertIndex++) {
    for (let horIndex = 0; horIndex < horizontalSize; horIndex++) {
      const char = splittedBoard[horIndex][vertIndex];
      const westChar = vertIndex > 0 ? splittedBoard[horIndex][vertIndex - 1] : false;
      const eastChar = vertIndex < verticalSize - 1 ? splittedBoard[horIndex][vertIndex + 1] : false;
      const northChar = horIndex > 0 ? splittedBoard[horIndex - 1][vertIndex] : false;
      const southChar = horIndex < horizontalSize - 1 ? splittedBoard[horIndex + 1][vertIndex] : false;
      generatedBoard = generatedBoard.setIn([vertIndex, horIndex], fromJS({
        isPawnBox: char === pawnBox,
        N: northChar === verticalConnection || (northChar === pawnBox && char === verticalConnection) || (northChar === pawnBox && char === pawnBox),
        S: southChar === verticalConnection || (southChar === pawnBox && char === verticalConnection) || (southChar === pawnBox && char === pawnBox),
        W: westChar === horizontalConnection || (westChar === pawnBox && char === horizontalConnection) || (westChar === pawnBox && char === pawnBox),
        E: eastChar === horizontalConnection || (eastChar === pawnBox && char === horizontalConnection) || (eastChar === pawnBox && char === pawnBox),
        pawn: undefined,
      }));
    }
  }
  return generatedBoard;
}

export const board = generateBoard(nineMerelsBoard);

export const playerPawns = 9;
