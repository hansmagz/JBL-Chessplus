export enum PiecesEnum {
  KING = 'K',
  QUEEN = 'Q',
  BISHOP = 'B',
  BISHOPPAWN = 'BP',
  KNIGHT = 'N',
  ROOK = 'R',
  PAWN = 'P',
};

export function findPieceEnum(str: string): PiecesEnum {
  const upperStr = str.toUpperCase();
  for (const key in PiecesEnum) {
    const enumValue = PiecesEnum[key as keyof typeof PiecesEnum];
    if (enumValue.toUpperCase() === upperStr || enumValue.split('').reverse().join('').toUpperCase() === upperStr) {
      return PiecesEnum[key as keyof typeof PiecesEnum];
    }
  }
  return PiecesEnum.PAWN;
}