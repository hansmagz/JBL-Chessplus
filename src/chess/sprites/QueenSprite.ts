import { ChessPieceSprite } from "./ChessPieceSprite";
import { Game } from "../../scenes/Game";
import { Pos, ChessColor } from "../JBLChessplus";

// Class representing the GUI for a queen
export class QueenSprite extends ChessPieceSprite {
  constructor(scene: Game, pos: Pos, color: ChessColor) {
    super(scene, [2, 3], color, pos);
  }
}

export class QueenBishopSprite extends ChessPieceSprite {
  constructor(scene: Game, pos: Pos, color: ChessColor) {
    super(scene, [22, 23], color, pos);
  }
}

export class QueenKnightSprite extends ChessPieceSprite {
  constructor(scene: Game, pos: Pos, color: ChessColor) {
    super(scene, [24, 25], color, pos);
  }
}

export class QueenRookSprite extends ChessPieceSprite {
  constructor(scene: Game, pos: Pos, color: ChessColor) {
    super(scene, [26, 27], color, pos);
  }
}

export class QueenPawnSprite extends ChessPieceSprite {
  constructor(scene: Game, pos: Pos, color: ChessColor) {
    super(scene, [28, 29], color, pos);
  }
}