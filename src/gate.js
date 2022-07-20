const NAMES = ['H', 'X', 'Y', 'Z', 'S', 'T']
const SHAPES = [
  [['I', 'I', 'I', 'I'], ['H', 'H', 'H', 'H'], ['I', 'I', 'I', 'I'], ['I', 'I', 'I', 'I']],
  [['X', 'I', 'I'], ['X', 'X', 'X'], ['I', 'I', 'I']],
  [['I', 'I', 'Y'], ['Y', 'Y', 'Y'], ['I', 'I', 'I']],
  [['Z', 'Z'], ['Z', 'Z']],
  [['I', 'S', 'S'], ['S', 'S', 'I'], ['I', 'I', 'I']],
  [['I', 'T', 'I'], ['T', 'T', 'T'], ['I', 'I', 'I']],
  // [[7, 7, 'I'], ['I', 7, 7], ['I', 'I', 'I']]
];
const COLORS = ['cyan', 'blue', 'orange', 'green', 'purple', 'red'];

export class Gate {
  static get NAMES() {
    return NAMES;
  }

  static get SHAPES() {
    return SHAPES;
  }

  static get COLORS() {
    return COLORS;
  }

  constructor(ctx) {
    this.ctx = ctx;

    const typeId = this.randomizeTetrominoType(Gate.COLORS.length);
    this.name = Gate.NAMES[typeId];
    this.shape = Gate.SHAPES[typeId];
    this.color = Gate.COLORS[typeId];

    this.x = 0;
    this.y = 0;
  }

  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 'I') {
          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);

          // draw gate name
          this.ctx.fillStyle = '#000';
          this.ctx.font = '1px sans-serif';
          this.ctx.fillText(this.name, this.x + x, this.y + y + 1);
        }
      });
    });

    // draw gate name
    // this.ctx.fillStyle = '#000';
    // this.ctx.font = '1px sans-serif';
    // this.ctx.fillText(this.name, this.x, this.y + 1);
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
