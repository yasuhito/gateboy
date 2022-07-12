class Board {
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
      {length: ROWS}, () => Array(COLS).fill(0)
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
        return value === 0 || (this.isInsideWalls(x, y) && this.isNotOccupied(x, y));
      });
    });
  }

  isNotOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  isInsideWalls(x, y) {
    return (
      x >= 0 && // Left wall
      x < COLS && // Right wall
      y < ROWS // Bottom wall
    );
  }

  drop() {
    let gate = moves[KEY.DOWN](this.gate);

    if (this.valid(gate)) {
      this.gate.move(gate);
    } else {
      this.freeze();
      this.clearLines();
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
        if (value > 0) {
          this.grid[y + this.gate.y][x + this.gate.x] = value;
        }
      });
   });
  }

  draw() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value - 1];
          this.ctx.fillRect(x, y, 1, 1);

          this.ctx.fillStyle = '#000';
          this.ctx.font = '1px sans-serif';
          this.ctx.fillText(NAMES[value - 1], x, y + 1);
        }
      });
    });
  }

  clearLines() {
    let lines = 0;
    this.grid.forEach((row, y) => {
      // If every value is greater than zero then we have a full row.
      if (row.every(value => value > 0)) {
        lines++; // Increase for cleared line

        this.grid.splice(y, 1); // Remove the row.

        // Add zero filled row at the top.
        this.grid.unshift(Array(COLS).fill(0));

        if (lines > 0) {
          // Add points if we cleared some lines
          account.score += this.getLineClearPoints(lines);
          account.lines += lines

          // If we have reached the lines for next level
          if (account.lines >= LINES_PER_LEVEL) {
            // Goto next level
            account.level++;

            // Remove lines so we start working for the next level
            account.lines -= LINES_PER_LEVEL;

            // Increase speed of game
            time.level = LEVEL[account.level];
          }
        }
      }
    });
  }

  getLineClearPoints(lines) {
    const lineClearPoints =
      lines === 1 ? POINTS.SINGLE :
      lines === 2 ? POINTS.DOUBLE :
      lines === 3 ? POINTS.TRIPLE :
      lines === 4 ? POINTS.TETRIS :
      0;

    return (account.level + 1) * lineClearPoints;
  }
}
