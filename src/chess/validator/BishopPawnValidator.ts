import { PiecesEnum } from "../../enums";
import { ChessColor, Pos } from "../JBLChessplus";
import { ChessPieceValidator } from "./ChessPieceValidator";

// class to represent a validator to validate bishop moves
export class BishopPawnValidator extends ChessPieceValidator {
  constructor(color: ChessColor) {
    const dirs: Pos[] = [
      //Bishop
      [-1, -1],
      [-2, -2],
      [-3, -3],
      [-4, -4],
      [-5, -5],
      [-6, -6],
      [-7, -7],

      [-1, 1],
      [-2, 2],
      [-3, 3],
      [-4, 4],
      [-5, 5],
      [-6, 6],
      [-7, 7],

      [1, -1],
      [2, -2],
      [3, -3],
      [4, -4],
      [5, -5],
      [6, -6],
      [7, -7],

      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],

      //Pawn
      [-1, 0],
    ];
    // a bishop can move and capture diagonally across the whole board
    super(PiecesEnum.BISHOPPAWN, color, dirs, dirs, 1);
  }
}