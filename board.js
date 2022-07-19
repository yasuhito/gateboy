import {COLS, COLORS, GATES_PER_LEVEL, KEY, LEVEL, NAMES, POINTS, ROWS, moves} from './constants.js'
import { Gate } from './gate.js';

export class Board {
  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.grid = this.getEmptyBoard();
    this.setNextGate();
    this.setCurrentGate();
  }

  // Get matrix filled with zeros.
  getEmptyBoard() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill('I')
    );
  }

  rotate(gate){
    // Clone with JSON
    let g = JSON.parse(JSON.stringify(gate));

    // Transpose matrix, g is the Gate
    for (let y = 0; y < gate.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [g.shape[x][y], g.shape[y][x]] =
        [g.shape[y][x], g.shape[x][y]];
      }
    }

    // Reverse the order of the columns.
    g.shape.forEach(row => row.reverse());

    return g;
  }

  valid(gate) {
    return gate.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = gate.x + dx;
        let y = gate.y + dy;
        return value === 'I' || (this.isInsideWalls(x, y) && this.isNotOccupied(x, y));
      });
    });
  }

  isNotOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 'I';
  }

  isInsideWalls(x, y) {
    return (
      x >= 0 && // Left wall
      x < COLS && // Right wall
      y < ROWS // Bottom wall
    );
  }

  drop(account, time) {
    let gate = moves[KEY.DOWN](this);

    if (this.valid(gate)) {
      this.gate.move(gate);
    } else {
      this.freeze();

      for (;;) {
        const reducedGates = this.reduceGates(account, time);
        const numDroppedGates = this.dropUnconnectedGates();
        if (reducedGates === 0 && numDroppedGates === 0) break;
      }

      if (this.gate.y === 0) { // Game over
        return false;
      }
      this.setCurrentGate();
    }
    return true;
  }

  setNextGate() {
    const { width, height } = this.ctxNext.canvas;
    this.nextGate = new Gate(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.nextGate.draw();
  }

  setCurrentGate() {
    this.gate = this.nextGate;
    this.gate.ctx = this.ctx;
    this.gate.x = 3;
    this.setNextGate();
  }

  freeze() {
    this.gate.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 'I') {
          this.grid[y + this.gate.y][x + this.gate.x] = value;
        }
      });
   });
  }

  draw() {
    // console.table(this.grid)

    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 'I') {
          const index = NAMES.indexOf(value)

          this.ctx.fillStyle = COLORS[index];
          this.ctx.fillRect(x, y, 1, 1);

          this.ctx.fillStyle = '#000';
          this.ctx.font = '1px sans-serif';
          this.ctx.fillText(value, x, y + 1);
        }
      });
    });
  }

  reduceGates(account, time) {
    let gates = 0;

    for (let y = ROWS - 1; y > 0; y--) {
      for (let x = 0; x < COLS; x++) {
        const gateName = this.grid[y][x]

        if (gateName !== 'I') {
          if (gateName === this.grid[y - 1][x]) {
            // HH, XX, YY, ZZ → I
            if (gateName === 'H' || gateName === 'X' || gateName === 'Y' || gateName === 'Z') {
              this.grid[y][x] = 'I'
              this.grid[y - 1][x] = 'I'

              gates += 2
              account.score += this.getGateReducePoints(2, account.level);
            } else if (gateName === 'S') { // SS = Z
              this.grid[y][x] = 'Z'
              this.grid[y - 1][x] = 'I'

              gates += 1
              account.score += this.getGateReducePoints(1, account.level);
            } else if (gateName === 'T') { // TT = S
              this.grid[y][x] = 'S'
              this.grid[y - 1][x] = 'I'

              gates += 1
              account.score += this.getGateReducePoints(1, account.level);
            }
          }
        }
      }
    }

    if (gates > 0) {
      // Add points if we cleared some gates
      account.score += this.getGateReducePoints(gates, account.level);
      account.gates += gates

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

  dropUnconnectedGates() {
    let numDroppedGates = 0

    for (let y = ROWS - 2; y > 0; y--) {
      for (let x = 0; x < COLS; x++) {
        const gateName = this.grid[y][x]

        if (gateName !== 'I') {
          const sameColorGates = []
          this.findSameColorGates(y, x, sameColorGates)

          const droppable = sameColorGates.every((each) => {
            return each.y + 1 < ROWS && this.grid[each.y + 1][each.x] === 'I'
          })

          if (droppable) {
            for (const gate of sameColorGates) {
              for (let targetRow = gate.y + 1; targetRow < ROWS; targetRow++) {
                if (this.grid[targetRow][gate.x] === 'I') {
                  this.grid[targetRow - 1][gate.x] = 'I'
                  this.grid[targetRow][gate.x] = gateName
                }
              }
            }

            numDroppedGates++
          }
        }
      }
    }
    return numDroppedGates
  }

  findSameColorGates(row, col, gates) {
    const done = gates.some((each) => each.y === row && each.x === col)
    if (done) return

    const gateName = this.grid[row][col]
    gates.push({y: row, x: col })

    if (row + 1 < ROWS && this.grid[row + 1][col] === gateName) this.findSameColorGates(row + 1, col, gates)
    if (col + 1 < COLS && this.grid[row][col + 1] === gateName) this.findSameColorGates(row, col + 1, gates)
    if (row - 1 >= 0 && this.grid[row - 1][col] === gateName) this.findSameColorGates(row - 1, col, gates)
    if (col - 1 >= 0 && this.grid[row][col - 1] === gateName) this.findSameColorGates(row, col - 1, gates)
  }

  getGateReducePoints(gates, level) {
    const gateReducePoints =
      gates === 1 ? POINTS.SINGLE :
      gates === 2 ? POINTS.DOUBLE :
      gates === 3 ? POINTS.TRIPLE :
      gates === 4 ? POINTS.TETRIS :
      0;

    return (level + 1) * gateReducePoints;
  }
}
