import { ChessPieceSprite } from "./ChessPieceSprite";
import { Game } from "../../scenes/Game";
import { Pos, ChessColor } from "../JBLChessplus";

// Class representing the GUI for a pawn
export class PawnSprite extends ChessPieceSprite {
  constructor(scene: Game, pos: Pos, color: ChessColor) {
    super(scene, [10, 11], color, pos);
  }
}