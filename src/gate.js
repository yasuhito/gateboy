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
  static random() {
    const typeId = this.randomizeGateType();
    const gate = new Gate(this.NAMES[typeId])

    return gate
  }

  // TODO: implement TGM (The Grand Master series) randomizer
  static randomizeGateType() {
    const noOfTypes = Gate.NAMES.length;
    return Math.floor(Math.random() * noOfTypes);
  }

  static get NAMES() {
    return NAMES;
  }

  static get SHAPES() {
    return SHAPES;
  }

  static get COLORS() {
    return COLORS;
  }

  constructor(name) {
    const typeId = Gate.NAMES.indexOf(name)

    this.name = name
    this.shape = Gate.SHAPES[typeId];
    this.color = Gate.COLORS[typeId];
    this.x = 0;
    this.y = 0;
  }

  draw(ctx) {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 'I') return;

        // draw gate rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + x, this.y + y, 1, 1);

        // draw gate name
        ctx.fillStyle = '#000';
        ctx.font = '1px sans-serif';
        ctx.fillText(this.name, this.x + x, this.y + y + 1);
      });
    });
  }

  move(gate) {
    this.x = gate.x;
    this.y = gate.y;
    this.shape = gate.shape;
  }
}
