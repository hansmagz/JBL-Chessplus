export enum PiecesEnum {
  KING = 'K',
  KINGQUEEN = 'KQ',
  KINGBISHOP = 'KB',
  KINGKNIGHT = 'KN',
  KINGROOK = 'KR',
  KINGPAWN = 'KP',

  QUEEN = 'Q',
  QUEENQUEEN = 'QQ',
  QUEENBISHOP = 'QB',
  QUEENKNIGHT = 'QN',
  QUEENKROOK = 'QR',
  QUEENPAWN = 'QP',

  BISHOP = 'B',
  BISHOPBISHOP = 'BB',
  BISHOPKNIGHT = 'BN',
  BISHOPROOK = 'BR',
  BISHOPPAWN = 'BP',

  KNIGHT = 'N',
  KNIGHTKNIGHT = 'NN',
  KNIGHTROOK = 'NR',
  KNIGHTPAWN = 'NP',

  ROOK = 'R',
  ROOKROOK = 'RR',
  ROOKPAWN = 'RP',
  
  PAWN = 'P',
  PAWNPAWN = 'PP',
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