function generateMessage(text: string) {
  return player => `${player}: ${text}`;
}

export const putPawn = generateMessage('put pawn on the board');
export const removePawn = generateMessage('remove opponent pawn from the board');

