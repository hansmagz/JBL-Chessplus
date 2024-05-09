import { ChessPieceSprite } from "./ChessPieceSprite";
import { Game } from "../../scenes/Game";
import { Pos, ChessColor } from "../JBLChessplus";

// Class representing the GUI for a king
export class KingSprite extends ChessPieceSprite {
  constructor(scene: Game, pos: Pos, color: ChessColor) {
    super(scene, [0, 1], color, pos);
  }
}