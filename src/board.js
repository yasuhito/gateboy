import { GATES_PER_LEVEL, KEY, LEVEL, POINTS, moves } from "./constants.js";
import { Gate } from "./gate.js";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

export class Board {
  static createBoardCanvasContext() {
    const canvas = document.getElementById("board");
    const ctx = canvas.getContext("2d");

    // Calculate size of canvas from constants.
    ctx.canvas.width = Board.COLS * Board.BLOCK_SIZE;
    ctx.canvas.height = Board.ROWS * Board.BLOCK_SIZE;

    // Scale blocks
    ctx.scale(Board.BLOCK_SIZE, Board.BLOCK_SIZE);

    return ctx;
  }

  static createNextCanvasContext() {
    const canvasNext = document.getElementById("next");
    const ctx = canvasNext.getContext("2d");

    // Size canvas for four blocks.
    ctx.canvas.width = 4 * Board.BLOCK_SIZE;
    ctx.canvas.height = 4 * Board.BLOCK_SIZE;

    // Scale blocks
    ctx.scale(Board.BLOCK_SIZE, Board.BLOCK_SIZE);

    return ctx;
  }

  static get COLS() {
    return COLS;
  }

  static get ROWS() {
    return ROWS;
  }

  static get BLOCK_SIZE() {
    return BLOCK_SIZE;
  }

  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.grid = this._getEmptyBoard();
    this._setNextGate();
    this._setCurrentGate();
  }

  // Get matrix filled with zeros.
  _getEmptyBoard() {
    return Array.from({ length: Board.ROWS }, () =>
      Array(Board.COLS).fill("I")
    );
  }

  rotate(gate) {
    const newGate = JSON.parse(JSON.stringify(gate));

    // Transpose matrix
    for (let y = 0; y < gate.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [newGate.shape[x][y], newGate.shape[y][x]] = [
          newGate.shape[y][x],
          newGate.shape[x][y],
        ];
      }
    }

    // Reverse the order of the columns.
    newGate.shape.forEach((row) => row.reverse());

    return newGate;
  }

  isValidPosition(gate) {
    return gate.shape.every((row, dy) => {
      return row.every((each, dx) => {
        const x = gate.x + dx;
        const y = gate.y + dy;
        return (
          each === "I" ||
          (this._isInsideWalls(x, y) && this._isNotOccupied(x, y))
        );
      });
    });
  }

  _isNotOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === "I";
  }

  _isInsideWalls(x, y) {
    return (
      x >= 0 && // Left wall
      x < Board.COLS && // Right wall
      y < Board.ROWS // Bottom wall
    );
  }

  drop(account, time) {
    let gate = moves[KEY.DOWN](this);

    if (this.isValidPosition(gate)) {
      this.gate.move(gate);
    } else {
      this._freeze();

      for (;;) {
        const reducedGates = this._reduceGates(account, time);
        const numDroppedGates = this._dropUnconnectedGates();
        if (reducedGates === 0 && numDroppedGates === 0) break;
      }

      if (this.gate.y === 0) {
        // Game over
        return false;
      }
      this._setCurrentGate();
    }
    return true;
  }

  _setNextGate() {
    const { width, height } = this.ctxNext.canvas;
    this.nextGate = Gate.random();
    this.ctxNext.clearRect(0, 0, width, height);
    this.nextGate.draw(this.ctxNext);
  }

  _setCurrentGate() {
    this.gate = this.nextGate;
    this.gate.x = 3;
    this._setNextGate();
  }

  _freeze() {
    this.gate.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== "I") {
          this.grid[y + this.gate.y][x + this.gate.x] = value;
        }
      });
    });
  }

  draw() {
    // console.table(this.grid)

    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== "I") {
          const index = Gate.NAMES.indexOf(value);

          this.ctx.fillStyle = Gate.COLORS[index];
          this.ctx.fillRect(x, y, 1, 1);

          this.ctx.fillStyle = "#000";
          this.ctx.font = "1px sans-serif";
          this.ctx.fillText(value, x, y + 1);
        }
      });
    });
  }

  _reduceGates(account, time) {
    let gates = 0;

    for (let y = Board.ROWS - 1; y > 0; y--) {
      for (let x = 0; x < Board.COLS; x++) {
        const gateName = this.grid[y][x];

        if (gateName !== "I") {
          if (gateName === this.grid[y - 1][x]) {
            // HH, XX, YY, ZZ → I
            if (
              gateName === "H" ||
              gateName === "X" ||
              gateName === "Y" ||
              gateName === "Z"
            ) {
              this.grid[y][x] = "I";
              this.grid[y - 1][x] = "I";

              gates += 2;
              account.score += this._getGateReducePoints(2, account.level);
            } else if (gateName === "S") {
              // SS = Z
              this.grid[y][x] = "Z";
              this.grid[y - 1][x] = "I";

              gates += 1;
              account.score += this._getGateReducePoints(1, account.level);
            } else if (gateName === "T") {
              // TT = S
              this.grid[y][x] = "S";
              this.grid[y - 1][x] = "I";

              gates += 1;
              account.score += this._getGateReducePoints(1, account.level);
            }
          } else if (gateName === "X" && this.grid[y - 1][x] === "Z") {
            // XZ = Y
            this.grid[y][x] = "Y";
            this.grid[y - 1][x] = "I";
          } else if (gateName === "Z" && this.grid[y - 1][x] === "X") {
            // ZX = Y
            this.grid[y][x] = "Y";
            this.grid[y - 1][x] = "I";
          }
        }
      }
    }

    if (gates > 0) {
      // Add points if we cleared some gates
      account.score += this._getGateReducePoints(gates, account.level);
      account.gates += gates;

      // If we have reached the gates for next level
      if (account.gates >= GATES_PER_LEVEL) {
        // Goto next level
        account.level++;

        // Remove gates so we start working for the next level
        account.gates -= GATES_PER_LEVEL;

        // Increase speed of game
        time.level = LEVEL[account.level];
      }
    }

    return gates;
  }

  _dropUnconnectedGates() {
    let numDroppedGates = 0;

    for (let y = Board.ROWS - 2; y > 0; y--) {
      for (let x = 0; x < Board.COLS; x++) {
        const gateName = this.grid[y][x];

        if (gateName !== "I") {
          const sameColorGates = [];
          this._findSameColorGates(y, x, sameColorGates);

          const droppable = sameColorGates.every((each) => {
            return (
              each.y + 1 < Board.ROWS && this.grid[each.y + 1][each.x] === "I"
            );
          });

          if (droppable) {
            for (const gate of sameColorGates) {
              for (
                let targetRow = gate.y + 1;
                targetRow < Board.ROWS;
                targetRow++
              ) {
                if (this.grid[targetRow][gate.x] === "I") {
                  this.grid[targetRow - 1][gate.x] = "I";
                  this.grid[targetRow][gate.x] = gateName;
                }
              }
            }

            numDroppedGates++;
          }
        }
      }
    }
    return numDroppedGates;
  }

  _findSameColorGates(row, col, gates) {
    const done = gates.some((each) => each.y === row && each.x === col);
    if (done) return;

    const gateName = this.grid[row][col];
    gates.push({ y: row, x: col });

    if (row + 1 < Board.ROWS && this.grid[row + 1][col] === gateName)
      this._findSameColorGates(row + 1, col, gates);
    if (col + 1 < Board.COLS && this.grid[row][col + 1] === gateName)
      this._findSameColorGates(row, col + 1, gates);
    if (row - 1 >= 0 && this.grid[row - 1][col] === gateName)
      this._findSameColorGates(row - 1, col, gates);
    if (col - 1 >= 0 && this.grid[row][col - 1] === gateName)
      this._findSameColorGates(row, col - 1, gates);
  }

  _getGateReducePoints(gates, level) {
    const gateReducePoints =
      gates === 1
        ? POINTS.SINGLE
        : gates === 2
        ? POINTS.DOUBLE
        : gates === 3
        ? POINTS.TRIPLE
        : gates === 4
        ? POINTS.TETRIS
        : 0;

    return (level + 1) * gateReducePoints;
  }
}
