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

function generateBoard(boardString) {
  const splittedBoard = boardString.replace(/(\r\n|\n|\r)/gm, '').split(newLine).filter(Boolean);
  const horizontalSize = splittedBoard[0].length;
  const verticalSize = splittedBoard.length;
  const generatedBoard = Array.from({ length: horizontalSize }, () => Array.from({ length: verticalSize }));

  for (let vertIndex = 0; vertIndex < verticalSize; vertIndex++) {
    for (let horIndex = 0; horIndex < horizontalSize; horIndex++) {
      const char = splittedBoard[horIndex][vertIndex];
      const westChar = vertIndex > 0 ? splittedBoard[horIndex][vertIndex - 1] : false;
      const eastChar = vertIndex < verticalSize - 1 ? splittedBoard[horIndex][vertIndex + 1] : false;
      const northChar = horIndex > 0 ? splittedBoard[horIndex - 1][vertIndex] : false;
      const southChar = horIndex < horizontalSize - 1 ? splittedBoard[horIndex + 1][vertIndex] : false;
      generatedBoard[vertIndex][horIndex] = {
        isPawnBox: char === pawnBox,
        N: northChar === verticalConnection || (northChar === pawnBox && char === verticalConnection),
        S: southChar === verticalConnection || (southChar === pawnBox && char === verticalConnection),
        W: westChar === horizontalConnection || (westChar === pawnBox && char === horizontalConnection),
        E: eastChar === horizontalConnection || (eastChar === pawnBox && char === horizontalConnection),
        pawn: undefined,
      };
    }
  }
  return generatedBoard;
}

export const board = generateBoard(nineMerelsBoard);
