class Gate {
  constructor(ctx) {
    this.ctx = ctx;

    const typeId = this.randomizeTetrominoType(COLORS.length);
    this.name = NAMES[typeId];
    this.shape = SHAPES[typeId];
    this.color = COLORS[typeId];

    this.x = 0;
    this.y = 0;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });

    // draw gate nae
    this.ctx.fillStyle = '#000';
    this.ctx.font = '1px sans-serif';
    this.ctx.fillText(this.name, this.x, this.y + 1);
  }

  move(gate) {
    this.x = gate.x;
    this.y = gate.y;
    this.shape = gate.shape;
  }

  // TODO: implement TGM (The Grand Master series) randomizer
  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes);
  }
}
