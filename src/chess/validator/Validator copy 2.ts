import { PiecesEnum } from "../../enums";
import { ChessColor, Pos } from "../JBLChessplus";
import { ChessPieceValidator } from "./ChessPieceValidator";

export class BishopPawnValidator extends ChessPieceValidator {
  constructor(color: ChessColor) {
    const dirs: Pos[] = [
      [0, 0],
    ];
    super(PiecesEnum.BISHOPPAWN, color, dirs, dirs, 1);
  }
}