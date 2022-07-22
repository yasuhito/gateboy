import { I, H, X, Y, Z, S, T } from "./constants.js";

const NAMES = [H, X, Y, Z, S, T];
const SHAPES = [
  [
    [I, H, I],
    [H, H, H],
    [I, I, I],
  ],
  [
    [X, I, I],
    [X, X, X],
    [I, I, I],
  ],
  [
    [I, I, Y],
    [Y, Y, Y],
    [I, I, I],
  ],
  [
    [I, Z, Z],
    [Z, Z, I],
    [I, I, I],
  ],
  [
    [S, S],
    [S, S],
  ],
  [
    [I, I, I, I],
    [T, T, T, T],
    [I, I, I, I],
    [I, I, I, I],
  ],
  // [[7, 7, 'I'], ['I', 7, 7], ['I', 'I', 'I']]
];
const COLORS = ["cyan", "blue", "orange", "green", "purple", "red"];

export class Block {
  static random() {
    const typeId = this.randomizeBlockType();
    const block = new Block(this.NAMES[typeId]);

    return block;
  }

  // TODO: implement TGM (The Grand Master series) randomizer
  static randomizeBlockType() {
    const noOfTypes = Block.NAMES.length;
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
    const typeId = Block.NAMES.indexOf(name);
    if (typeId === -1) throw new Error(`Invalid block name: ${name}`);

    this.name = name;
    this.shape = Block.SHAPES[typeId];
    this.color = Block.COLORS[typeId];
    this.x = 0;
    this.y = 0;
  }

  draw(ctx) {
    this.shape.forEach((row, y) => {
      row.forEach((gate, x) => {
        if (gate === I) return;

        // draw gate rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + x, this.y + y, 1, 1);

        // draw gate name
        ctx.fillStyle = "#000";
        ctx.font = "1px sans-serif";
        ctx.fillText(this.name, this.x + x, this.y + y + 1);
      });
    });
  }

  move(block) {
    this.x = block.x;
    this.y = block.y;
    this.shape = block.shape;
  }
}
