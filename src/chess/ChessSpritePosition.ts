import { GameObjects } from "phaser";
import { BishopSprite, BishopKnightSprite, BishopRookSprite, BishopPawnSprite } from "./sprites/BishopSprite";
import { ChessPieceSprite } from "./sprites/ChessPieceSprite";
import { KingSprite, KingQueenSprite, KingBishopSprite, KingKnightSprite, KingRookSprite, KingPawnSprite } from "./sprites/KingSprite";
import { KnightSprite, KnightRookSprite, KnightPawnSprite } from "./sprites/KnightSprite";
import { PawnSprite } from "./sprites/PawnSprite";
import { QueenSprite, QueenBishopSprite, QueenKnightSprite, QueenRookSprite, QueenPawnSprite } from "./sprites/QueenSprite";
import { RookSprite, RookPawnSprite } from "./sprites/RookSprite";
import { Game } from "../scenes/Game";
import { ChessPositionArrayNotation, Pos, PieceNotation, ChessColor } from "./JBLChessplus";

// Class to represent the GUI for Chess
export class ChessSpritePosition {
  #state: (ChessPieceSprite | null)[][]; // 2D array to store chess piece sprites
  scene: Game; // Reference to the game scene
  container: GameObjects.Container; // Container to hold chess piece sprites

  constructor(game: Game, state: ChessPositionArrayNotation) {
    // Initialize properties
    this.container = game.add.container(0, 0);
    this.#state = state.map((row, r) => row.map(
      (type, c) => {
        const sprite = createChessPieceSprite(game, type, [r, c]); // Create chess piece sprite
        if (sprite) {
          this.container.add(sprite); // Add sprite to container
        }
        return sprite; // Return sprite
      }
    ));
    this.scene = game; // Assign game scene reference
  }

  // Getter for retrieving the state of the chess sprites
  get state() { return this.#state.map(row => row.slice()) }

  // Method to get the chess piece sprite at a given position
  at([r, c]: Pos): ChessPieceSprite | null {
    return this.#state?.[r]?.[c];
  }

  // Method to set a chess piece sprite at a given position
  setAt([r, c]: Pos, piece: ChessPieceSprite | null) {
    this.#state[r][c] = piece;
  }

  // Method to promote a pawn to another piece
  promote(pos: Pos, piece: PieceNotation) {
    this.at(pos)?.destroy(); // Destroy existing pawn sprite
    const sprite = createChessPieceSprite(this.scene, piece, pos) as ChessPieceSprite; // Create new sprite for promoted piece
    this.container.add(sprite); // Add sprite to container
    this.setAt(pos, sprite); // Set sprite at position
  }

  // Method to capture a piece
  capture(from: Pos, to: Pos) {
    this.explode(to); // Explode the captured piece
    // this.at(from)?.move(to); // Move capturing piece to new position
    this.move(from, to);
    // this.explode(from); // Explode the capturing piece
    // this.explodeArea(to); // Explode surrounding pieces affected by capture
  }

  // Method to capture a piece
  combine(from: Pos, to: Pos, combineTo: PieceNotation) {
    console.log(`Sprite combine:`, combineTo)
    this.spark(to); // Explode the captured piece
    this.move(from, to);
    this.spark(to); // Explode the captured piece
    const sprite = createChessPieceSprite(this.scene, combineTo, to) as ChessPieceSprite; // Create new sprite for combines piece
    this.container.add(sprite); // Add sprite to container
    this.setAt(to, sprite)
  }

  // Method to perform kingside castling
  castleKingside(color: ChessColor) {
    const r = [7, 0][color];
    this.move([r, 4], [r, 6]); // Move king
    this.move([r, 7], [r, 5]); // Move rook
  }

  // Method to perform queenside castling
  castleQueenside(color: ChessColor) {
    const r = [7, 0][color];
    this.move([r, 4], [r, 2]); // Move king
    this.move([r, 0], [r, 3]); // Move rook
  }

  // Method to perform en passant capture
  enPassant(from: Pos, to: Pos) {
    const r1 = from[0];
    const c2 = to[1];
    this.explode([r1, c2]);
    this.move(from, to);
    // this.explode(from);
    // this.explodeArea(to);
  }

  // Method to move a piece
  move(from: Pos, to: Pos) {
    const piece = this.at(from); // Get piece at source position
    piece?.move(to); // Move the piece
    this.setAt(to, piece); // Set piece at new position
    this.setAt(from, null); // Remove piece from old position
  }

  // Method to explode a piece
  explode(pos: Pos) {
    this.at(pos)?.explode(); // Explode the piece
    this.setAt(pos, null); // Remove piece from position
  }

  // Method to explode a piece
  spark(pos: Pos) {
    this.at(pos)?.spark(); // Explode the piece
    this.setAt(pos, null); // Remove piece from position
  }

  // Method to explode surrounding pieces affected by capture
  explodeArea([r, c]: Pos) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const pos: Pos = [r + dr, c + dc];
        if (!this.at(pos) || this.at(pos) instanceof PawnSprite) continue;
        this.explode(pos); // Explode surrounding piece
      }
    }
  }
}

// Factory method to create a chess piece sprite
function createChessPieceSprite(scene: Game, type: PieceNotation | null, pos: Pos) {
  if (!type) return null;
  // Map piece notations to corresponding sprite constructors
  const constructors: Record<PieceNotation, { new(scene: Game, pos: Pos, color: ChessColor): ChessPieceSprite }> = {
    'K': KingSprite,
    'KQ': KingQueenSprite,
    'KB': KingBishopSprite,
    'KN': KingKnightSprite,
    'KR': KingRookSprite,
    'KP': KingPawnSprite,
    'Q': QueenSprite,
    'QQ': QueenSprite,
    'QB': QueenBishopSprite,
    'QN': QueenKnightSprite,
    'QR': QueenRookSprite,
    'QP': QueenPawnSprite,
    'B': BishopSprite,
    'BB': BishopSprite,
    'BN': BishopKnightSprite,
    'BR': BishopRookSprite,
    'BP': BishopPawnSprite,
    'N': KnightSprite,
    'NN': KnightSprite,
    'NR': KnightRookSprite,
    'NP': KnightPawnSprite,
    'R': RookSprite,
    'RR': RookSprite,
    'RP': RookPawnSprite,
    'P': PawnSprite,
    'PP': PawnSprite,
    'k': KingSprite,
    'kq': KingQueenSprite,
    'kb': KingBishopSprite,
    'kn': KingKnightSprite,
    'kr': KingRookSprite,
    'kp': KingPawnSprite,
    'q': QueenSprite,
    'qq': QueenSprite,
    'qb': QueenBishopSprite,
    'qn': QueenKnightSprite,
    'qr': QueenRookSprite,
    'qp': QueenPawnSprite,
    'b': BishopSprite,
    'bb': BishopSprite,
    'bn': BishopKnightSprite,
    'br': BishopRookSprite,
    'bp': BishopPawnSprite,
    'n': KnightSprite,
    'nn': KnightSprite,
    'nr': KnightRookSprite,
    'np': KnightPawnSprite,
    'r': RookSprite,
    'rr': RookSprite,
    'rp': RookPawnSprite,
    'p': PawnSprite,
    'pp': PawnSprite,
  };
  const color = type.toUpperCase() == type ? 0 : 1; // Determine piece color
  return scene.add.existing(new constructors[type](scene, pos, color)); // Create and return sprite
}
