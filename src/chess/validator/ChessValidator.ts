import { ChessColor, FENData, PieceNotation, Pos, equals } from "../JBLChessplus";
import { ChessPosition } from "../ChessPosition";
import { BishopValidator } from "./BishopValidator";
import { BishopPawnValidator } from "./BishopPawnValidator";
import { ChessPieceValidator } from "./ChessPieceValidator";
import { KingValidator } from "./KingValidator";
import { KnightValidator } from "./KnightValidator";
import { PawnValidator } from "./PawnValidator";
import { QueenValidator } from "./QueenValidator";
import { RookValidator } from "./RookValidator";
import { findPieceEnum } from "../../enums";

// A dictionary mapping piece notations to their respective validators
const pieceValidators: Record<PieceNotation, ChessPieceValidator> = {
  'K': new KingValidator(0),  // King for white pieces
  'KQ': new KingValidator(0),
  'KB': new KingValidator(0),
  'KN': new KingValidator(0),
  'KR': new KingValidator(0),
  'KP': new KingValidator(0),
  'Q': new QueenValidator(0), // Queen for white pieces
  'QQ': new QueenValidator(0),
  'QB': new QueenValidator(0),
  'QN': new QueenValidator(0),
  'QR': new QueenValidator(0),
  'QP': new QueenValidator(0),
  'B': new BishopValidator(0), // Bishop for white pieces
  'BB': new BishopValidator(0),
  'BN': new BishopValidator(0),
  'BR': new BishopValidator(0),
  'BP': new BishopPawnValidator(0),
  'N': new KnightValidator(0), // Knight for white pieces
  'NN': new KnightValidator(0),
  'NR': new KnightValidator(0),
  'NP': new KnightValidator(0),
  'R': new RookValidator(0), // Rook for white pieces
  'RR': new RookValidator(0),
  'RP': new RookValidator(0),
  'P': new PawnValidator(0), // Pawn for white pieces
  'PP': new PawnValidator(0),
  'k': new KingValidator(0),  // King for black pieces
  'kq': new KingValidator(0),
  'kb': new KingValidator(0),
  'kn': new KingValidator(0),
  'kr': new KingValidator(0),
  'kp': new KingValidator(0),
  'q': new QueenValidator(0), // Queen for black pieces
  'qq': new QueenValidator(0),
  'qb': new QueenValidator(0),
  'qn': new QueenValidator(0),
  'qr': new QueenValidator(0),
  'qp': new QueenValidator(0),
  'b': new BishopValidator(0), // Bishop for black pieces
  'bb': new BishopValidator(0),
  'bn': new BishopValidator(0),
  'br': new BishopValidator(0),
  'bp': new BishopPawnValidator(0),
  'n': new KnightValidator(0), // Knight for black pieces
  'nn': new KnightValidator(0),
  'nr': new KnightValidator(0),
  'np': new KnightValidator(0),
  'r': new RookValidator(0), // Rook for black pieces
  'rr': new RookValidator(0),
  'rp': new RookValidator(0),
  'p': new PawnValidator(0), // Pawn for black pieces
  'pp': new PawnValidator(0),
};

// Checks if a piece at the given position exists and matches the current player color
function canMovePiece(data: FENData, from: Pos) {
  const { position, activeColor } = data;
  return position.colorAt(from) == activeColor;
}

// Returns the corresponding validator for the piece at the given position
function getValidatorAt(data: FENData, from: Pos): ChessPieceValidator | null {
  const piece = data.position.at(from);
  return piece ? pieceValidators[piece] : null;
}

function getValidatorByNotation(piece: PieceNotation): ChessPieceValidator {
  return pieceValidators[piece];
}

// Returns an array of valid moves from a given position
export function getValidMovesFrom(data: FENData, from: Pos): Pos[] {
  if (!canMovePiece(data, from)) return [];
  return getValidatorAt(data, from)?.getValidMovesFrom(data, from) ?? [];
}

// Combined pieces compatible
export function getValidMovesByNotation(data: FENData, from: Pos): Pos[] {
  if (!canMovePiece(data, from)) return [];

  const pieceString = data.position.at(from)!.toString();
  if (pieceString.length > 1) { // Combined
    const [firstPiece, secondPiece] = pieceString.split('');
    const firstPieceMoves = pieceValidators[findPieceEnum(firstPiece)]?.getValidMovesFrom(data, from) ?? [];
    const secondPieceMoves = pieceValidators[findPieceEnum(secondPiece)]?.getValidMovesFrom(data, from) ?? [];
    return [...firstPieceMoves, ...secondPieceMoves];
  } else {
    return getValidatorAt(data, from)?.getValidMovesFrom(data, from) ?? [];
  }
}

// Checks if a pawn is promoting
export function isPawnPromotion(data: FENData, from: Pos, to: Pos): boolean {
  const { position, activeColor } = data;
  const piece = position.at(from);
  if (!piece) return false; // If there's no piece at the given position, return false
  const color = position.colorAt(from);
  if (color != activeColor) return false; // If the piece color doesn't match the active color, return false
  const validator = pieceValidators[piece];
  if (!(validator instanceof PawnValidator)) return false; // If the piece is not a pawn, return false
  const r = to[0];
  return [0, 7][color] == r; // Check if the pawn reaches the last rank
}

// Checks if a standard move is valid
export function isValidStandardMove(data: FENData, from: Pos, to: Pos): boolean {
  if (!canMovePiece(data, from)) return false;
  const pieceString = data.position.at(from)?.toString() || '';

  if (pieceString.length === 1) {
    const validator = getValidatorAt(data, from);
    return validator?.getValidStandardMovesFrom(data, from).some(p => equals(p, to)) || false;
  }

  const [firstPiece, secondPiece] = pieceString.split('');
  const firstValidator = getValidatorByNotation(findPieceEnum(firstPiece));
  const secondValidator = getValidatorByNotation(findPieceEnum(secondPiece));

  return (
    firstValidator?.getValidStandardMovesFrom(data, from).some(p => equals(p, to)) ||
    secondValidator?.getValidStandardMovesFrom(data, from).some(p => equals(p, to)) ||
    false
  );
}

// Checks if a capture move is valid
export function isValidCapture(data: FENData, from: Pos, to: Pos): boolean {
  if (!canMovePiece(data, from)) return false;
  const pieceString = data.position.at(from)?.toString() || '';

  if (pieceString.length === 1) {
    const validator = getValidatorAt(data, from);
    return validator?.getValidCapturesFrom(data, from).some(p => equals(p, to)) || false;
  }

  const [firstPiece, secondPiece] = pieceString.split('');
  const firstValidator = getValidatorByNotation(findPieceEnum(firstPiece));
  const secondValidator = getValidatorByNotation(findPieceEnum(secondPiece));

  return (
    firstValidator?.getValidCapturesFrom(data, from).some(p => equals(p, to)) ||
    secondValidator?.getValidCapturesFrom(data, from).some(p => equals(p, to)) ||
    false
  );
}

// Checks if a combine move is valid
export function isValidCombine(data: FENData, from: Pos, to: Pos): boolean {
  if (data.position.colorAt(to) != data.activeColor) return false;
  if (!canMovePiece(data, from)) return false;
  const validator = getValidatorAt(data, from);
  if (!validator) return false;
  return validator.getValidCapturesFrom(data, from)
    .some(p => equals(p, to));
}

// Checks if a double move (for pawn) is valid
export function isValidDoubleMove(data: FENData, from: Pos, to: Pos): boolean {
  if (!canMovePiece(data, from)) return false;
  const pieceString = data.position.at(from)?.toString() || '';

  if (pieceString.length === 1) {
    const validator = getValidatorAt(data, from);
    if (!(validator instanceof PawnValidator)) return false;
    return validator.getValidDoubleMovesFrom(data, from).some(p => equals(p, to));
  }

  const [firstPiece, secondPiece] = pieceString.split('');
  const firstValidator = getValidatorByNotation(findPieceEnum(firstPiece));
  const secondValidator = getValidatorByNotation(findPieceEnum(secondPiece));

  if (firstValidator instanceof PawnValidator) {
    return firstValidator.getValidDoubleMovesFrom(data, from).some(p => equals(p, to));
  } else if (secondValidator instanceof PawnValidator) {
    return secondValidator.getValidDoubleMovesFrom(data, from).some(p => equals(p, to));
  }

  return false;
}

// Checks if an en passant move is valid
export function isValidEnPassant(data: FENData, from: Pos, to: Pos): boolean {
  if (!canMovePiece(data, from)) return false;
  const pieceString = data.position.at(from)?.toString() || '';

  if (pieceString.length === 1) {
    const validator = getValidatorAt(data, from);
    if (!(validator instanceof PawnValidator)) return false;
    return validator.getValidEnPassantsFrom(data, from).some(p => equals(p, to));
  }

  const [firstPiece, secondPiece] = pieceString.split('');
  const firstValidator = getValidatorByNotation(findPieceEnum(firstPiece));
  const secondValidator = getValidatorByNotation(findPieceEnum(secondPiece));

  if (firstValidator instanceof PawnValidator) {
    return firstValidator.getValidEnPassantsFrom(data, from).some(p => equals(p, to));
  } else if (secondValidator instanceof PawnValidator) {
    return secondValidator.getValidEnPassantsFrom(data, from).some(p => equals(p, to));
  }

  return false;
}

// Checks if a kingside castle move is valid
export function isValidKingsideCastle(data: FENData, from: Pos, to: Pos): boolean {
  if (!canMovePiece(data, from)) return false;
  const pieceString = data.position.at(from)?.toString() || '';

  if (pieceString.length === 1) {
    const validator = getValidatorAt(data, from);
    if (!(validator instanceof KingValidator)) return false;
    return validator.getValidKingsideCastlesFrom(data, from).some(p => equals(p, to));
  }

  const [firstPiece, secondPiece] = pieceString.split('');
  const firstValidator = getValidatorByNotation(findPieceEnum(firstPiece));
  const secondValidator = getValidatorByNotation(findPieceEnum(secondPiece));

  if (firstValidator instanceof KingValidator) {
    return firstValidator.getValidKingsideCastlesFrom(data, from)
      .some(p => equals(p, to));
  } else if (secondValidator instanceof KingValidator) {
    return secondValidator.getValidKingsideCastlesFrom(data, from)
      .some(p => equals(p, to));
  }

  return false;
}

// Checks if a queenside castle move is valid
export function isValidQueensideCastle(data: FENData, from: Pos, to: Pos): boolean {
  if (!canMovePiece(data, from)) return false;
  const pieceString = data.position.at(from)?.toString() || '';

  if (pieceString.length === 1) {
    const validator = getValidatorAt(data, from);
    if (!(validator instanceof KingValidator)) return false;
    return validator.getValidQueensideCastleFrom(data, from).some(p => equals(p, to));
  }

  const [firstPiece, secondPiece] = pieceString.split('');
  const firstValidator = getValidatorByNotation(findPieceEnum(firstPiece));
  const secondValidator = getValidatorByNotation(findPieceEnum(secondPiece));

  if (firstValidator instanceof KingValidator) {
    return firstValidator.getValidQueensideCastleFrom(data, from).some(p => equals(p, to));
  } else if (secondValidator instanceof KingValidator) {
    return secondValidator.getValidQueensideCastleFrom(data, from).some(p => equals(p, to));
  }

  return false;
}

// Checks if a position results in atomic check
export function isAtomicCheck(position: ChessPosition, color: ChessColor): boolean {
  const enemyColor = getEnemyColor(color);
  const kingPos = position.indexOfKing(color);
  const enemyKingPos = position.indexOfKing(enemyColor);
  if (!kingPos || !enemyKingPos) return false; // If king positions are not found, return false
  if (position.isAdjacent(kingPos, enemyKingPos)) return false; // If kings are adjacent, return false
  const validators = Object.values(pieceValidators).filter(validator => validator.color != color);
  for (let { captureDirs, maxMoveSteps, type } of validators) {
    const [r, c] = kingPos;
    for (let [dr, dc] of captureDirs) {
      for (let i = 1; i <= maxMoveSteps; i++) {
        const pos: Pos = [r - i * dr, c - i * dc];
        if (!position.has(pos)) break;
        if (position.emptyAt(pos)) continue;
        if (position.colorAt(pos) != enemyColor || position.typeAt(pos) != type) break;
        return true; // If a piece threatens the king, return true
      }
    }
  }
  return false; // If no piece threatens the king, return false
}

// Returns an array of valid moves for a player
export function getValidPlayerMoves(data: FENData, color: ChessColor): Pos[] {
  const { position } = data;
  return position.state.map((row, r) => row.map(
    (_, c) => [r, c] as Pos
  )).flat()
    .filter(p => position.colorAt(p) == color)
    .map(p => getValidMovesFrom(data, p))
    .flat();
}

// Checks if valid moves exist for a player
export function existsValidPlayerMoves(data: FENData, color: ChessColor): boolean {
  return getValidPlayerMoves(data, color).length > 0;
}

// Checks if the current state leads to checkmate for a player
export function isCheckMate(data: FENData, color: ChessColor): boolean {
  return isAtomicCheck(data.position, color) && !getValidPlayerMoves(data, color).length;
}

// Checks if the current state leads to stalemate for a player
export function isStaleMate(data: FENData, color: ChessColor): boolean {
  return !isAtomicCheck(data.position, color) && !getValidPlayerMoves(data, color).length;
}

// Returns the enemy color given a color
export function getEnemyColor(color: ChessColor): ChessColor {
  return color == 0 ? 1 : 0;
}
